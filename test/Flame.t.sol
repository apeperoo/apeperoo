pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Flame} from "../contracts/Flame.sol";
import {MockApro} from "./MockApro.sol";

contract FlameTest is Test {
    uint256 constant START = 100_000 ether;
    uint256 constant SEED = 0.01 ether;

    MockApro apro;
    Flame flame;
    address burner = makeAddr("burner");
    address other = makeAddr("other");

    function setUp() public {
        apro = new MockApro();
        flame = new Flame{value: SEED}(address(apro), START);
        apro.mint(burner, 1_000_000 ether);
        apro.mint(other, 1_000_000 ether);
        vm.prank(burner);
        apro.approve(address(flame), type(uint256).max);
        vm.prank(other);
        apro.approve(address(flame), type(uint256).max);
        vm.deal(burner, 1 ether);
        vm.deal(other, 1 ether);
    }

    function test_deploySetsPointZeroOneEthPrize() public view {
        assertEq(flame.SEED_PRIZE(), SEED);
        assertEq(flame.currentPrize(), SEED);
        assertEq(address(flame).balance, SEED);
        assertEq(flame.requiredBurn(), START);
        assertEq(flame.roundId(), 1);
    }

    function test_deployRevertsWithoutExactSeed() public {
        MockApro token = new MockApro();
        vm.expectRevert(bytes("seed 0.01 ETH"));
        new Flame{value: 0}(address(token), START);
        vm.expectRevert(bytes("seed 0.01 ETH"));
        new Flame{value: 0.02 ether}(address(token), START);
    }

    function test_takeLeadBurnsAndRaisesQuote() public {
        uint256 before = apro.balanceOf(burner);
        vm.prank(burner);
        flame.takeLead();
        assertEq(apro.balanceOf(burner), before - START);
        assertEq(apro.balanceOf(address(flame)), 0);
        assertEq(flame.leader(), burner);
        assertEq(flame.requiredBurn(), (START * 10_500) / 10_000);
        assertEq(flame.totalBurned(), START);
        assertTrue(flame.leader() == burner);
    }

    function test_takeLeadRevertsAfterRound() public {
        vm.warp(block.timestamp + 10 minutes);
        vm.prank(burner);
        vm.expectRevert(bytes("round over"));
        flame.takeLead();
    }

    function test_lateBurnExtendsClockByFloor() public {
        uint256 almostEnd = flame.roundEndsAt() - 10;
        vm.warp(almostEnd);
        vm.prank(burner);
        flame.takeLead();
        assertEq(flame.roundEndsAt(), almostEnd + 60);
    }

    function test_fundAddsToCurrentPrize() public {
        flame.fund{value: 0.03 ether}();
        assertEq(flame.currentPrize(), 0.04 ether);
        assertEq(address(flame).balance, 0.04 ether);
    }

    function test_receiveAddsToPrize() public {
        (bool ok,) = address(flame).call{value: 0.01 ether}("");
        assertTrue(ok);
        assertEq(flame.currentPrize(), 0.02 ether);
    }

    function test_fundGoesToNextWhenExpired() public {
        vm.warp(flame.roundEndsAt());
        flame.fund{value: 0.05 ether}();
        assertEq(flame.currentPrize(), SEED);
        assertEq(flame.nextPrize(), 0.05 ether);
    }

    function test_finalizeWithNoLeaderRollsPrize() public {
        vm.warp(flame.roundEndsAt());
        flame.finalize();
        assertEq(flame.roundId(), 2);
        assertEq(flame.currentPrize(), SEED);
        assertEq(flame.leader(), address(0));
        assertEq(flame.requiredBurn(), START);
    }

    function test_lastBurnClaimsSeedPrize() public {
        vm.prank(burner);
        flame.takeLead();
        vm.warp(flame.roundEndsAt());
        flame.finalize();

        uint256 before = burner.balance;
        vm.prank(burner);
        flame.claim(1);
        assertEq(burner.balance, before + SEED);
        assertEq(address(flame).balance, 0);
    }

    function test_otherWalletCannotClaim() public {
        vm.prank(burner);
        flame.takeLead();
        vm.warp(flame.roundEndsAt());
        flame.finalize();
        vm.prank(other);
        vm.expectRevert(bytes("not last burn"));
        flame.claim(1);
    }

    function test_secondBurnerWins() public {
        vm.prank(burner);
        flame.takeLead();
        vm.prank(other);
        flame.takeLead();
        vm.warp(flame.roundEndsAt());
        flame.finalize();
        vm.prank(other);
        flame.claim(1);
        assertEq(other.balance, 1 ether + SEED);
        vm.prank(burner);
        vm.expectRevert(bytes("not last burn"));
        flame.claim(1);
    }
}
