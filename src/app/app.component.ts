import { Component } from '@angular/core';
import { WalletState, Web3ServiceService } from 'web3clr';
import { Subscription } from 'rxjs';

// Allow connect to this testnet only
const GOERLI_CHAIN_ID = 5;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Injected Web3 heavy lifter
  private web3service: Web3ServiceService;

  // When user connects/disconnects, changes account or network, we get an update
  private walletState: WalletState;

  private walletSubscription: Subscription;

  // Are we connected to a wallet
  connected: boolean;

  // Are we connected to a right chain
  correctChain: boolean;

  // Which address is active in the user wallet
  selectedAddress: string;

  // How much ETH balance user has in the selected address of the wallet
  selectedAddressEthBalance: number;

  constructor(web3service: Web3ServiceService) {
    // Get dependency injected Web3Service
    this.web3service = web3service;
  }

  ngOnInit(): void {
    // Start getting updates from the wallet
    this.walletSubscription = this.web3service.walletState.subscribe((data) => { this.updateWalletState(data) });
  }

  ngOnDestroy() {
    // Don't leak memory when the component is disposed
    this.walletSubscription.unsubscribe();
  }

  /**
   * User has updated their wallet (connected, changed account, changed network).
   *
   * This will determine if we can move forward in the wizard.
   */
  async updateWalletState(data: WalletState) {

    console.log("updateWalletState", data);
    this.walletState = data;

    if(data.currentlyConnected) {
      this.connected = true;
      this.correctChain = (data.chainId === GOERLI_CHAIN_ID);
      this.selectedAddress = data.selectedAddress;
    } else {
      this.connected = false;
      this.correctChain = false;
      this.selectedAddress = null;
    }

    // Trigger async fetch of user balance
    this.fetchUserEthBalance();
  }

  /**
   * Get the balance for the current address of the user.
   *
   * 1. User connects wallet first time
   * 2. User switches between accounts
   */
  async fetchUserEthBalance() {

    const web3 = this.walletState.web3;

    if(web3) {
      const currentAddress = this.walletState.selectedAddress;
      const rawBalance = await web3.eth.getBalance(currentAddress);
      this.selectedAddressEthBalance = parseFloat(web3.utils.fromWei(rawBalance, "ether"));
    } else {
      this.selectedAddressEthBalance = null;
    }
  }


}
