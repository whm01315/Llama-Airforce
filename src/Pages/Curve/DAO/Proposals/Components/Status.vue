<template>
  <KPI
    class="status"
    :label="t('status')"
    :has-value="true"
  >
    <span
      class="status-value"
      :class="getStatus(proposal)"
    >
      {{ statusLabel }}
    </span>
  </KPI>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import KPI from "@/Framework/KPI.vue";
import { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import { $computed } from "vue/macros";
import { getStatus } from "@/Pages/Curve/DAO/Proposals/Util/ProposalHelper";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

const statusLabel = $computed((): string => {
  switch (getStatus(proposal)) {
    case "active":
      return t("active");
    case "denied":
      return t("denied");
    case "passed":
      return t("passed");
    case "executed":
      return t("executed");
    default:
      return "Unk. Status";
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.status {
  .status-value {
    &.active {
      color: $yellow;
    }

    &.denied {
      color: $red;
    }

    &.passed {
      color: $green;
    }

    &.executed {
      color: lighten($purple, 8%);
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
status: Status
active: Active
denied: Denied
passed: Passed
executed: Executed
</i18n>
