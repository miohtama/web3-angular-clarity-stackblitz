import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from "@clr/angular";
import { Web3Config } from 'web3clr';
import { Web3Module } from 'web3clr';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AppComponent } from './app.component';


const web3config = {

  // We support only the built-in browser wallet (MetaMask)
  // and mobile wallets with WalletConnect support
  web3ModalProviderOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // This is the infura API key used by WalletConnect wallets for their web3 instance
        // Sign up and get your project id at https://infura.io/
        // Test id for Goerli network
        infuraId: "453d2049c15d4a8da5501a0464fa44f8",
      }
    },
  }
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    Web3Module
  ],
  providers: [
    // Export our web3 config to components and services
    { provide: Web3Config,  useValue: web3config }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
