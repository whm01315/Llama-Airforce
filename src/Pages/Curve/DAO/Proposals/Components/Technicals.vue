<template>
  <div class="technicals">
    <div class="technical">
      <div class="heading">{{ t("description") }}</div>
      <div class="description">{{ proposal.metadata }}</div>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedCallData = !expandedCallData"
      >
        {{ t("calldata") }}
        <i
          class="fas fa-chevron-up expander"
          :class="{ expandedCallData }"
        ></i>
      </div>
      <Collapsible :expanded="expandedCallData">
        <div
          v-if="proposalDetails"
          class="calldata"
          v-html="callData"
        ></div>
      </Collapsible>
    </div>

    <div class="technical">
      <div
        class="heading"
        @click="expandedVoters = !expandedVoters"
      >
        {{ t("voters") }} ({{ proposal.votes }})
        <i
          class="fas fa-chevron-up expander"
          :class="{ expandedVoters }"
        ></i>
      </div>

      <!-- Make scroll, not collabsible -->
      <Collapsible :expanded="expandedVoters">
        <div
          v-if="proposalDetails"
          class="voters"
        >
          <div class="for">
            <div class="title">{{ t("for") }}</div>

            <div
              v-for="vote in votesFor"
              :key="vote.voter"
              class="vote"
            >
              <div class="address">
                <a
                  :href="`https://etherscan.io/address/${vote.voter}`"
                  target="_blank"
                >
                  {{ addressShort(vote.voter) }}
                </a>
              </div>
              <div class="amount">
                <AsyncValue
                  :value="vote.stake"
                  :precision="0"
                  :show-symbol="false"
                  type="dollar"
                />
              </div>
            </div>
          </div>

          <div class="against">
            <div class="title">{{ t("against") }}</div>

            <div
              v-for="vote in votesAgainst"
              :key="vote.voter"
              class="vote"
            >
              <div class="amount">{{ vote.stake }}</div>
              <div class="address">
                <a
                  :href="`https://etherscan.io/address/${vote.voter}`"
                  target="_blank"
                >
                  {{ addressShort(vote.voter) }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import AsyncValue from "@/Framework/AsyncValue.vue";
import Collapsible from "@/Framework/Collapsible.vue";
import { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import ProposalService from "@/Pages/Curve/DAO/Proposals/Services/ProposalService";
import { getHost } from "@/Services/Host";
import { ProposalDetails } from "@/Pages/Curve/DAO/Proposals/Models/ProposalDetails";
import { addressShort } from "@/Wallet/WalletHelper";
import { chain } from "lodash";

const { t } = useI18n();

const proposalService = new ProposalService(getHost());

// Props
interface Props {
  proposal: Proposal;
  expanded: boolean;
}

const { proposal, expanded = false } = defineProps<Props>();

// Refs
let proposalDetails: ProposalDetails | null = $ref(null);
const expandedCallData = $ref(true);
const expandedVoters = $ref(false);

const callData = $computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return proposalDetails.script
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace("/\u251c/g", "├")
    .replace("/\u2500/g", "─");
});

const votesFor = $computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return chain(proposalDetails.votes)
    .filter((vote) => vote.supports)
    .orderBy((vote) => vote.stake, "desc")
    .value();
});

const votesAgainst = $computed(() => {
  if (!proposalDetails) {
    return null;
  }

  return chain(proposalDetails.votes)
    .filter((vote) => !vote.supports)
    .orderBy((vote) => vote.stake, "desc")
    .value();
});

// Watches
watch(
  () => expanded,
  async (expandedNew) => {
    if (expandedNew && proposalDetails === null) {
      proposalDetails = await proposalService.getProposalDetails(proposal);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.technicals {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;

  background-color: #18181b;
  border: solid 1px #35353b;

  > .technical {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    > .heading {
      display: flex;
      align-items: end;
      gap: 0.5rem;

      color: #a1a1aa;
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    .voters {
      display: grid;
      grid-template-columns: 1fr 1fr;
      row-gap: 0.25rem;
      gap: 2rem;

      > .for,
      > .against {
        > .title {
          display: flex;
          grid-row: 1 / span 2;
          font-weight: bold;
        }

        > .vote {
          display: grid;
          gap: 1rem;

          grid-template-columns: 1fr 1fr;

          > .amount,
          > .address {
            display: flex;
          }
        }
      }

      > .for {
        > .title {
          justify-content: end;
          color: $green;
        }

        > .vote {
          > .amount {
            justify-content: end;
          }
        }
      }

      > .against {
        > .title {
          color: $red;
        }

        > .vote {
          > .address {
            justify-content: end;
          }
        }
      }
    }

    .expander {
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expandedCallData,
      &.expandedVoters {
        transform: rotate(180deg);
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
description: Description
calldata: Calldata
voters: Voters
for: For
against: Against
</i18n>
