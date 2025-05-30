import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import {
  DEBUG,
  MAIL_FROM,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_SECURE_ENABLED,
  SMTP_USER,
  WEBAPP_URL,
} from "@/packages/lib/constants";
import { createInviteToken, createToken, createTokenForLinkSurvey } from "@/packages/lib/jwt";
import { EmailTemplate } from "./components/general/email-template";
import { ForgotPasswordEmail } from "./components/auth/forgot-password-email";
import { PasswordResetNotifyEmail } from "./components/auth/password-reset-notify-email";
import { OnboardingInviteEmail } from "./components/invite/onboarding-invite-email";
import { InviteEmail } from "./components/invite/invite-email";
import { InviteAcceptedEmail } from "./components/invite/invite-accepted-email";
import { EmbedSurveyPreviewEmail } from "./components/survey/embed-survey-preview-email";
import { LinkSurveyEmail } from "./components/survey/link-survey-email";
import { VerificationEmail } from "./components/auth/verification-email";
// import { getOrganizationByEnvironmentId } from "@formbricks/lib/organization/service";
// import type { TResponse } from "@formbricks/types/responses";
// import type { TSurvey } from "@formbricks/types/surveys";
// import type { TWeeklySummaryNotificationResponse } from "@formbricks/types/weeklySummary";
// import { ForgotPasswordEmail } from "./components/auth/forgot-password-email";
// import { PasswordResetNotifyEmail } from "./components/auth/password-reset-notify-email";
// import { VerificationEmail } from "./components/auth/verification-email";
// import { EmailTemplate } from "./components/general/email-template";
// import { InviteAcceptedEmail } from "./components/invite/invite-accepted-email";
// import { InviteEmail } from "./components/invite/invite-email";
// import { OnboardingInviteEmail } from "./components/invite/onboarding-invite-email";
// import { EmbedSurveyPreviewEmail } from "./components/survey/embed-survey-preview-email";
// import { LinkSurveyEmail } from "./components/survey/link-survey-email";
// import { ResponseFinishedEmail } from "./components/survey/response-finished-email";
// import { NoLiveSurveyNotificationEmail } from "./components/weekly-summary/no-live-survey-notification-email";
// import { WeeklySummaryNotificationEmail } from "./components/weekly-summary/weekly-summary-notification-email";

export const IS_SMTP_CONFIGURED = Boolean(SMTP_HOST && SMTP_PORT);

interface SendEmailDataProps {
  to: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html: string;
}

interface TEmailUser {
  id: string;
  email: string;
}

export interface LinkSurveyEmailData {
  surveyId: string;
  email: string;
  suId: string;
  surveyData?:
    | {
        name?: string;
        subheading?: string;
      }
    | null
    | undefined;
}

// const getEmailSubject = (productName: string): string => {
//   return `${productName} User Insights - Last Week by Formbricks`;
// };

export const sendEmail = async (emailData: SendEmailDataProps) => {
  if (!IS_SMTP_CONFIGURED) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE_ENABLED, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    logger: DEBUG,
    debug: DEBUG,
  } as SMTPTransport.Options);
  const emailDefaults = {
    from: `Formplay <${MAIL_FROM ?? "noreply@formplay.com"}>`,
  };
  await transporter.sendMail({ ...emailDefaults, ...emailData });
};

export const sendVerificationEmail = async (user: TEmailUser) => {
  const token = createToken(user.id, user.email, {
    expiresIn: "1d",
  });
  const verifyLink = `${WEBAPP_URL}/auth/verify?token=${encodeURIComponent(token)}`;
  const verificationRequestLink = `${WEBAPP_URL}/auth/verification-requested?email=${encodeURIComponent(
    user.email
  )}`;
  await sendEmail({
    to: user.email,
    subject: "Please verify your email to use Formbricks",
    html: render(EmailTemplate({ content: VerificationEmail({ verificationRequestLink, verifyLink }) })),
  });
};

export const sendForgotPasswordEmail = async (user: TEmailUser) => {
  const token = createToken(user.id, user.email, {
    expiresIn: "1d",
  });
  const verifyLink = `${WEBAPP_URL}/auth/forgot-password/reset?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your Formbricks password",
    html: render(EmailTemplate({ content: ForgotPasswordEmail({ verifyLink }) })),
  });
};

export const sendPasswordResetNotifyEmail = async (user: TEmailUser) => {
  await sendEmail({
    to: user.email,
    subject: "Your Formbricks password has been changed",
    html: render(EmailTemplate({ content: PasswordResetNotifyEmail() })),
  });
};

export const sendInviteMemberEmail = async (
  inviteId: string,
  email: string,
  inviterName: string,
  inviteeName: string,
  isOnboardingInvite?: boolean,
  inviteMessage?: string
) => {
  const token = createInviteToken(inviteId, email, {
    expiresIn: "7d",
  });

  const verifyLink = `${WEBAPP_URL}/invite?token=${encodeURIComponent(token)}`;

  if (isOnboardingInvite && inviteMessage) {
    await sendEmail({
      to: email,
      subject: `${inviterName} needs a hand setting up Formbricks.  Can you help out?`,
      html: render(
        EmailTemplate({ content: OnboardingInviteEmail({ verifyLink, inviteMessage, inviterName }) })
      ),
    });
  } else {
    await sendEmail({
      to: email,
      subject: `You're invited to collaborate on Formbricks!`,
      html: render(EmailTemplate({ content: InviteEmail({ inviteeName, inviterName, verifyLink }) })),
    });
  }
};

export const sendInviteAcceptedEmail = async (inviterName: string, inviteeName: string, email: string) => {
  await sendEmail({
    to: email,
    subject: `You've got a new organization member!`,
    html: render(EmailTemplate({ content: InviteAcceptedEmail({ inviteeName, inviterName }) })),
  });
};

// export const sendResponseFinishedEmail = async (
//   email: string,
//   environmentId: string,
//   survey: TSurvey,
//   response: TResponse,
//   responseCount: number
// ) => {
//   const personEmail = response.personAttributes?.email;
//   const organization = await getOrganizationByEnvironmentId(environmentId);

//   if (!organization) {
//     throw new Error("Organization not found");
//   }

//   await sendEmail({
//     to: email,
//     subject: personEmail
//       ? `${personEmail} just completed your ${survey.name} survey ✅`
//       : `A response for ${survey.name} was completed ✅`,
//     replyTo: personEmail?.toString() ?? MAIL_FROM,
//     html: render(
//       EmailTemplate({
//         content: ResponseFinishedEmail({
//           survey,
//           responseCount,
//           response,
//           WEBAPP_URL,
//           environmentId,
//           organization,
//         }),
//       })
//     ),
//   });
// };

export const sendEmbedSurveyPreviewEmail = async (
  to: string,
  subject: string,
  html: string,
  environmentId: string
) => {
  await sendEmail({
    to,
    subject,
    html: render(EmailTemplate({ content: EmbedSurveyPreviewEmail({ html, environmentId }) })),
  });
};

export const sendLinkSurveyToVerifiedEmail = async (data: LinkSurveyEmailData) => {
  const surveyId = data.surveyId;
  const email = data.email;
  const surveyData = data.surveyData;
  const singleUseId = data.suId;
  const token = createTokenForLinkSurvey(surveyId, email);
  const getSurveyLink = () => {
    if (singleUseId) {
      return `${WEBAPP_URL}/s/${surveyId}?verify=${encodeURIComponent(token)}&suId=${singleUseId}`;
    }
    return `${WEBAPP_URL}/s/${surveyId}?verify=${encodeURIComponent(token)}`;
  };
  await sendEmail({
    to: data.email,
    subject: "Your Formbricks Survey",
    html: render(EmailTemplate({ content: LinkSurveyEmail({ surveyData, getSurveyLink }) })),
  });
};

// export const sendWeeklySummaryNotificationEmail = async (
//   email: string,
//   notificationData: TWeeklySummaryNotificationResponse
// ) => {
//   const startDate = `${notificationData.lastWeekDate.getDate().toString()} ${notificationData.lastWeekDate.toLocaleString(
//     "default",
//     { month: "short" }
//   )}`;
//   const endDate = `${notificationData.currentDate.getDate().toString()} ${notificationData.currentDate.toLocaleString(
//     "default",
//     { month: "short" }
//   )}`;
//   const startYear = notificationData.lastWeekDate.getFullYear();
//   const endYear = notificationData.currentDate.getFullYear();
//   await sendEmail({
//     to: email,
//     subject: getEmailSubject(notificationData.productName),
//     html: render(
//       EmailTemplate({
//         content: WeeklySummaryNotificationEmail({
//           notificationData,
//           startDate,
//           endDate,
//           startYear,
//           endYear,
//         }),
//       })
//     ),
//   });
// };

// export const sendNoLiveSurveyNotificationEmail = async (
//   email: string,
//   notificationData: TWeeklySummaryNotificationResponse
// ) => {
//   const startDate = `${notificationData.lastWeekDate.getDate().toString()} ${notificationData.lastWeekDate.toLocaleString(
//     "default",
//     { month: "short" }
//   )}`;
//   const endDate = `${notificationData.currentDate.getDate().toString()} ${notificationData.currentDate.toLocaleString(
//     "default",
//     { month: "short" }
//   )}`;
//   const startYear = notificationData.lastWeekDate.getFullYear();
//   const endYear = notificationData.currentDate.getFullYear();
//   await sendEmail({
//     to: email,
//     subject: getEmailSubject(notificationData.productName),
//     html: render(
//       EmailTemplate({
//         content: NoLiveSurveyNotificationEmail({
//           notificationData,
//           startDate,
//           endDate,
//           startYear,
//           endYear,
//         }),
//       })
//     ),
//   });
// };
