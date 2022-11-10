/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  GaugeFactory,
  GaugeFactoryInterface,
} from "../../veFunder/GaugeFactory";

const _abi = [
  {
    name: "NewGauge",
    inputs: [
      {
        name: "_instance",
        type: "address",
        indexed: true,
      },
      {
        name: "_receiver",
        type: "address",
        indexed: true,
      },
      {
        name: "_max_emissions",
        type: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
    type: "event",
  },
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      {
        name: "_implementation",
        type: "address",
      },
    ],
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    name: "deploy_gauge",
    inputs: [
      {
        name: "_receiver",
        type: "address",
      },
      {
        name: "_max_emissions",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
  {
    stateMutability: "pure",
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "get_gauge_count",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "get_gauge_by_idx",
    inputs: [
      {
        name: "arg0",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
  },
];

export class GaugeFactory__factory {
  static readonly abi = _abi;
  static createInterface(): GaugeFactoryInterface {
    return new utils.Interface(_abi) as GaugeFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GaugeFactory {
    return new Contract(address, _abi, signerOrProvider) as GaugeFactory;
  }
}