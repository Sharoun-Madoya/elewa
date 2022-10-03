import { RawWhatsAppApiPayload, WhatsAppResponse } from "@app/model/convs-mgr/functions";
import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, HttpsContext, RestResult, RestResult200 } from "@ngfi/functions";
import { __ConvertWhatsAppApiPayload } from "../utils/convert-whatsapp-payload.util";

export class WhatsAppMessageHookHandler extends FunctionHandler< RawWhatsAppApiPayload , RestResult>
{
  public async execute(payload:RawWhatsAppApiPayload, context: HttpsContext, tools: HandlerTools)
  {
    if (this._dataResIsEmpty(payload)) {
      tools.Logger.log(() => `[WhatsAppMessageHookHandler] webhook is being validated first.⚠`);
      return this._verifyWhatsAppTokenWebHook(context, tools);
    } else {
      tools.Logger.log(() => `[WhatsAppMessageHookHandler]: Processing data from webhook.⌚`);
      const convertedData: WhatsAppResponse = __ConvertWhatsAppApiPayload(payload);
      tools.Logger.log(() => `[WhatsAppMessageHookHandler]: Data is ${JSON.stringify(convertedData)}📅`);
    }
  }

  //Checks if data object is empty since it means webhook is not verified yet
  private _dataResIsEmpty(data) {
    return Object.keys(data).length === 0;
  }

  //Verifies webhook for meta
  //@See https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
  private _verifyWhatsAppTokenWebHook(context: any, tools: HandlerTools)
  {
    tools.Logger.log(() => `[WhatsAppMessageHookHandler] Token match successful ✅`);
    const challengeKey = "hub.challenge";
    return (context.eventContext.request.query[challengeKey]) as RestResult200;
  }

}