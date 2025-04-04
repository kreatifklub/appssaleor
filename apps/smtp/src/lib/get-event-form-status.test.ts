import { describe, expect, it } from "vitest";

import { getEventFormStatus } from "./get-event-form-status";

describe("getEventFormStatus", function () {
  it("No message or disable flag, when event other than GIFT_CARD_SENT is passed", () => {
    expect(
      getEventFormStatus({
        eventType: "ORDER_CREATED",
        appPermissions: ["MANAGE_GIFT_CARD"],
        featureFlags: {
          giftCardSentEvent: true,
          orderRefundedEvent: true,
        },
      }),
    ).toStrictEqual({
      isDisabled: false,
      missingPermission: undefined,
      requiredSaleorVersion: undefined,
    });
    expect(
      getEventFormStatus({
        eventType: "ORDER_CREATED",
        appPermissions: [],
        featureFlags: {
          giftCardSentEvent: false,
          orderRefundedEvent: true,
        },
      }),
    ).toStrictEqual({
      isDisabled: false,
      missingPermission: undefined,
      requiredSaleorVersion: undefined,
    });
  });

  it("Return disable flag and lack of the permission message, when GIFT_CARD_SENT is passed and app has no manage gift card permission", () => {
    expect(
      getEventFormStatus({
        eventType: "GIFT_CARD_SENT",
        appPermissions: [],
        featureFlags: {
          giftCardSentEvent: true,
          orderRefundedEvent: true,
        },
      }),
    ).toStrictEqual({
      isDisabled: true,
      missingPermission: "MANAGE_GIFT_CARD",
      requiredSaleorVersion: undefined,
    });
  });

  it("Return disable flag and unsupported Saleor version message, when GIFT_CARD_SENT is passed with missing feature flag", () => {
    expect(
      getEventFormStatus({
        eventType: "GIFT_CARD_SENT",
        appPermissions: ["MANAGE_GIFT_CARD"],
        featureFlags: {
          giftCardSentEvent: false,
          orderRefundedEvent: true,
        },
      }),
    ).toStrictEqual({
      isDisabled: true,
      missingPermission: undefined,
      requiredSaleorVersion: ">=3.13",
    });
  });
});
