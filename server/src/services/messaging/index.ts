import { env } from '../../config/env';
import { logger } from '../../utils/logger';

/**
 * Where a one-time code gets delivered.
 *
 * Same shape as the code-execution sandbox: one interface, swappable drivers.
 * The whole reset flow works today on the `console` driver with zero external
 * accounts, and switching to real SMS is a config change, not a code change.
 *
 * Real SMS to Indian numbers is not just an API key — TRAI requires DLT
 * registration of the sender ID and the message template before a transactional
 * SMS will deliver. That is why the default is a driver that needs nothing.
 */
export interface DeliveryResult {
  ok: boolean;
  /** Only ever set by the console driver, so dev can complete the flow. */
  devCode?: string;
  detail: string;
}

export interface MessageProvider {
  readonly name: string;
  readonly channel: 'EMAIL' | 'SMS';
  sendOtp(to: string, code: string, minutes: number): Promise<DeliveryResult>;
}

/** Development default — prints the code to the server log. */
class ConsoleProvider implements MessageProvider {
  readonly name = 'console';
  readonly channel: 'EMAIL' | 'SMS' = 'SMS';

  async sendOtp(to: string, code: string, minutes: number): Promise<DeliveryResult> {
    logger.info('─────────────────────────────────────────');
    logger.info(`  PASSWORD RESET CODE for ${to}`);
    logger.info(`  ${code}   (valid ${minutes} minutes)`);
    logger.info('─────────────────────────────────────────');
    return {
      ok: true,
      // Surfaced to the client ONLY in development — see password-reset.service.
      devCode: code,
      detail: 'Code printed to the server console',
    };
  }
}

/**
 * Twilio. Set SMS_PROVIDER=twilio plus the three TWILIO_* variables.
 * Uses the REST API directly — the SDK is a large dependency for one POST.
 */
class TwilioProvider implements MessageProvider {
  readonly name = 'twilio';
  readonly channel: 'EMAIL' | 'SMS' = 'SMS';

  async sendOtp(to: string, code: string, minutes: number): Promise<DeliveryResult> {
    const sid = env.TWILIO_ACCOUNT_SID;
    const token = env.TWILIO_AUTH_TOKEN;
    const from = env.TWILIO_FROM_NUMBER;

    if (!sid || !token || !from) {
      return {
        ok: false,
        detail: 'Twilio is selected but TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER are not set',
      };
    }

    const body = new URLSearchParams({
      To: to,
      From: from,
      Body: `${code} is your DevPrep password reset code. Valid for ${minutes} minutes. Do not share it.`,
    });

    try {
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body,
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        logger.error('Twilio rejected the message', { status: res.status, text: text.slice(0, 300) });
        return { ok: false, detail: `Twilio responded ${res.status}` };
      }
      return { ok: true, detail: 'SMS queued with Twilio' };
    } catch (err) {
      logger.error('Twilio request failed', { message: err instanceof Error ? err.message : String(err) });
      return { ok: false, detail: 'Could not reach Twilio' };
    }
  }
}

/**
 * MSG91 — commonly used for Indian numbers. Needs a DLT-approved template.
 * Set SMS_PROVIDER=msg91 plus MSG91_AUTH_KEY and MSG91_TEMPLATE_ID.
 */
class Msg91Provider implements MessageProvider {
  readonly name = 'msg91';
  readonly channel: 'EMAIL' | 'SMS' = 'SMS';

  async sendOtp(to: string, code: string): Promise<DeliveryResult> {
    const key = env.MSG91_AUTH_KEY;
    const template = env.MSG91_TEMPLATE_ID;

    if (!key || !template) {
      return { ok: false, detail: 'MSG91 is selected but MSG91_AUTH_KEY / MSG91_TEMPLATE_ID are not set' };
    }

    try {
      const res = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: { authkey: key, 'content-type': 'application/json' },
        body: JSON.stringify({
          template_id: template,
          mobile: to.replace(/^\+/, ''),
          otp: code,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        logger.error('MSG91 rejected the message', { status: res.status, text: text.slice(0, 300) });
        return { ok: false, detail: `MSG91 responded ${res.status}` };
      }
      return { ok: true, detail: 'SMS queued with MSG91' };
    } catch (err) {
      logger.error('MSG91 request failed', { message: err instanceof Error ? err.message : String(err) });
      return { ok: false, detail: 'Could not reach MSG91' };
    }
  }
}

function build(): MessageProvider {
  switch (env.SMS_PROVIDER) {
    case 'twilio':
      return new TwilioProvider();
    case 'msg91':
      return new Msg91Provider();
    default:
      return new ConsoleProvider();
  }
}

export const messageProvider: MessageProvider = build();

export const isConsoleProvider = (): boolean => messageProvider.name === 'console';
