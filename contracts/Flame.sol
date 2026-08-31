// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Last-burner lottery. Burn APRO to join. Last burn when the clock hits zero takes the ETH pot.
/// Deploy with Value = 0.01 ETH so round 1 already has a prize. Top up later by sending ETH or calling fund().
/// Not audited. Do not deploy without review.
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IBurnable {
    function burn(uint256 amount) external;
}

contract Flame {
    uint256 public constant BURN_STEP_BPS = 10_500;
    uint256 public constant BPS = 10_000;
    uint256 public constant ROUND = 10 minutes;
    uint256 public constant RESPONSE_FLOOR = 60 seconds;
    uint256 public constant SEED_PRIZE = 0.01 ether;
    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;

    IERC20 public immutable apro;
    uint256 public immutable startBurn;

    uint256 public roundId;
    uint256 public roundEndsAt;
    uint256 public requiredBurn;
    uint256 public currentPrize;
    uint256 public nextPrize;
    uint256 public totalBurned;
    address public leader;

    mapping(uint256 => address) public winner;
    mapping(uint256 => uint256) public pot;
    mapping(uint256 => bool) public claimed;

    event LeadTaken(
        uint256 indexed roundId,
        address indexed leader,
        uint256 amount,
        uint256 nextRequired,
        uint256 endsAt,
        uint256 at
    );
    event RoundFinalized(uint256 indexed roundId, address indexed winner, uint256 prize);
    event Funded(address indexed from, uint256 amount, bool toNext);
    event Claimed(address indexed user, uint256 indexed roundId, uint256 amount);

    constructor(address apro_, uint256 startBurn_) payable {
        require(apro_ != address(0), "addr");
        require(startBurn_ > 0, "burn");
        require(msg.value == SEED_PRIZE, "seed 0.01 ETH");
        // Intended start quote: 100_000 APRO = 100000 * 10**18
        apro = IERC20(apro_);
        startBurn = startBurn_;
        requiredBurn = startBurn_;
        roundId = 1;
        roundEndsAt = block.timestamp + ROUND;
        currentPrize = msg.value;
        emit Funded(msg.sender, msg.value, false);
    }

    receive() external payable {
        fund();
    }

    function takeLead() external {
        require(block.timestamp < roundEndsAt, "round over");
        uint256 amount = requiredBurn;
        require(amount > 0, "quote");

        leader = msg.sender;
        totalBurned += amount;
        requiredBurn = (amount * BURN_STEP_BPS) / BPS;

        uint256 floorEnd = block.timestamp + RESPONSE_FLOOR;
        if (floorEnd > roundEndsAt) roundEndsAt = floorEnd;

        _pull(apro, msg.sender, amount);
        _destroy(amount);

        emit LeadTaken(roundId, msg.sender, amount, requiredBurn, roundEndsAt, block.timestamp);
    }

    function finalize() external {
        require(block.timestamp >= roundEndsAt, "round live");
        uint256 id = roundId;
        require(winner[id] == address(0) && pot[id] == 0, "sealed");

        uint256 prize = currentPrize;
        currentPrize = 0;
        address champ = leader;

        if (champ == address(0) || prize == 0) {
            nextPrize += prize;
            emit RoundFinalized(id, address(0), 0);
        } else {
            winner[id] = champ;
            pot[id] = prize;
            emit RoundFinalized(id, champ, prize);
        }

        roundId = id + 1;
        requiredBurn = startBurn;
        leader = address(0);
        currentPrize = nextPrize;
        nextPrize = 0;
        roundEndsAt = block.timestamp + ROUND;
    }

    function fund() public payable {
        require(msg.value > 0, "amt");
        bool toNext = block.timestamp >= roundEndsAt;
        if (toNext) nextPrize += msg.value;
        else currentPrize += msg.value;
        emit Funded(msg.sender, msg.value, toNext);
    }

    function claim(uint256 id) external {
        require(msg.sender == winner[id], "not last burn");
        require(!claimed[id], "claimed");
        uint256 amount = pot[id];
        require(amount > 0, "empty");
        claimed[id] = true;
        _pushEth(msg.sender, amount);
        emit Claimed(msg.sender, id, amount);
    }

    function snapshot()
        external
        view
        returns (
            uint256 round,
            uint256 endsAt,
            uint256 required,
            address currentLeader,
            uint256 prize,
            uint256 upcoming,
            uint256 burned,
            bool expired
        )
    {
        return (
            roundId,
            roundEndsAt,
            requiredBurn,
            leader,
            currentPrize,
            nextPrize,
            totalBurned,
            block.timestamp >= roundEndsAt
        );
    }

    function account(address user) external view returns (bool lastBurn, uint256 claimable) {
        lastBurn = user != address(0) && user == leader;
        uint256 prev = roundId > 1 ? roundId - 1 : 0;
        if (prev != 0 && user == winner[prev] && !claimed[prev]) claimable = pot[prev];
    }

    function _destroy(uint256 amount) internal {
        try IBurnable(address(apro)).burn(amount) {} catch {
            _push(apro, DEAD, amount);
        }
    }

    function _pull(IERC20 token, address from, uint256 amount) internal {
        bool ok = token.transferFrom(from, address(this), amount);
        require(ok, "pull");
    }

    function _push(IERC20 token, address to, uint256 amount) internal {
        bool ok = token.transfer(to, amount);
        require(ok, "push");
    }

    function _pushEth(address to, uint256 amount) internal {
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "push");
    }
}
