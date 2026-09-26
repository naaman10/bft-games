# SendGrid to Resend Migration - Email Inventory

## Overview
This document catalogs all emails currently sent using SendGrid across the Brighter Futures ecosystem and provides a migration plan to Resend.

---

## Current State

### Repository: **brighterfutures** (Main Admin Dashboard)

**Package**: `@sendgrid/mail` (version ^8.1.6)

**Email Library**: `/lib/email.ts`
- Functions: `sendEmail()`, `sendTemplate()`
- Configuration:
  - `SENDGRID_API_KEY`
  - `SENDGRID_FROM_EMAIL`

**Email Logs**: `/lib/email-logs.ts`
- Function: `getEmailLogs()`
- Uses SendGrid Activity/Messages API
- Configuration:
  - `SENDGRID_ACTIVITY_API_KEY`
  - `SENDGRID_ACTIVITY_BASE_URL`

#### Emails Sent from brighterfutures:

| # | Email Type | Template ID | Sent From | Recipients | Attachments | Notes |
|---|------------|-------------|-----------|------------|-------------|-------|
| 1 | **Welcome Email** | `d-ed0dda2b7cf54a348006d3804db1a5ad` | `app/dashboard/students/[id]/actions.ts` | Parent email | 2 DOCX files (Terms & Conditions, Extra Materials) | Sent when student first enrolled, includes session start date/time |
| 2 | **Session Feedback** | `d-21f0024fd59847d48961a61b7ed33c22` | `app/dashboard/students/[id]/sessions/[sessionId]/actions.ts` | Parent email | None | Sent after each session with tutor feedback |
| 3 | **Lead Onboarding** | `d-ecb07c503ac942cca3bc3a245ef7c859` | `app/dashboard/leads/actions.ts` | Lead contact email | None | Sent to leads in "In Progress" status |
| 4 | **Invoice Email** | `d-0b61465b24144177bb2cd4f23a0bcb33` | `app/dashboard/invoices/actions.ts` | Parent email | Invoice PDF | Monthly invoice with PDF attachment |
| 5 | **Payment Reminder** | `d-81d93a6ccb88442eb76b2bacad30aabd` | `app/dashboard/invoices/actions.ts` | Parent email | None | Reminder for unpaid invoices |

**Dynamic Template Data Used:**

1. Welcome Email:
   - `parent_name`
   - `child_name`
   - `start_date` (dd/mm/yyyy)
   - `start_time` (HH:MM)

2. Session Feedback:
   - `parent_name`
   - `student_first_name`
   - `student_last_name`
   - `session_date`
   - `session_time`
   - `session_feedback` (markdown content)

3. Lead Onboarding:
   - `parent_name`

4. Invoice Email:
   - `parent_name`
   - `invoice_month` (e.g., "January 2026")

5. Payment Reminder:
   - `parent_name`
   - `invoice_month` (e.g., "January")

**Welcome Email Attachments:**
- Terms_and_conditions_2026.docx
- Extra_Materials_for_pupils.docx
- Fetched from Cloudinary at: `https://res.cloudinary.com/njh101010/raw/upload/v1772834069/brighterfutures/documents/`

---

### Repository: **bft-api** (Backend API)

**Package**: `resend` (version ^6.25.0) ✅ **Already using Resend!**

**Email Library**: 
- `/src/lib/resend.ts` - Resend client initialization
- `/src/lib/email.ts` - Email sending functions

**Configuration**:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `COMPLETION_NOTIFICATION_EMAIL`

#### Emails Sent from bft-api:

| # | Email Type | Function | Recipients | Template/Type | Notes |
|---|------------|----------|------------|---------------|-------|
| 1 | **Magic Link** | `sendMagicLinkEmail()` | Student email | Custom HTML/text | Sign-in, password reset, or email verification links |
| 2 | **Completion Notification** | `sendCompletionNotification()` | `COMPLETION_NOTIFICATION_EMAIL` | Resend template (`notification`) | Internal notification when student completes assignment |

**Magic Link Email Types:**
- Sign-in invitation (new account)
- Password reset
- Email verification

**Magic Link Dynamic Data:**
- `name` (optional)
- `linkUrl`
- `linkType` ("forget-password", "email-verification", or invite)

**Completion Notification Template Variables:**
- `email_subject`: "A pupil has completed an assignment"
- `email_recipient`: "Ellie"
- `email_body`: Student name, email, and content name
- `email_image`: BFT logo from Cloudinary

---

### Repository: **bft-learn** (Student Learning Platform)

**Package**: None - No direct email sending

**Notes**: Uses API proxy to bft-api for authentication emails (magic links via Neon Auth)

---

## Migration Plan

### Phase 1: brighterfutures Repository (PRIORITY)

This is the main repository that needs migration from SendGrid to Resend.

#### Steps:

1. **Install Resend Package**
   ```bash
   npm install resend
   ```

2. **Update Environment Variables**
   - Add: `RESEND_API_KEY`
   - Keep temporarily: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL` (for rollback)
   - Email logs will no longer be available via SendGrid Activity API

3. **Migrate SendGrid Dynamic Templates to Resend**

   Need to recreate 5 templates in Resend:
   
   a. **Welcome Email Template**
      - Variables: `parent_name`, `child_name`, `start_date`, `start_time`
      - Must support 2 DOCX attachments
   
   b. **Session Feedback Template**
      - Variables: `parent_name`, `student_first_name`, `student_last_name`, `session_date`, `session_time`, `session_feedback`
      - Markdown content needs rendering
   
   c. **Lead Onboarding Template**
      - Variables: `parent_name`
   
   d. **Invoice Email Template**
      - Variables: `parent_name`, `invoice_month`
      - Must support PDF attachment
   
   e. **Payment Reminder Template**
      - Variables: `parent_name`, `invoice_month`

4. **Code Changes Required**

   **File: `/lib/email.ts`**
   - Replace `import sgMail from "@sendgrid/mail"` with Resend client
   - Update `sendEmail()` function to use Resend API
   - Update `sendTemplate()` function to use Resend templates
   - Update error handling for Resend's error format

   **File: `/lib/email-logs.ts`**
   - Option 1: Remove email logs feature (Resend doesn't have equivalent activity API)
   - Option 2: Store email logs in database when emails are sent
   - Option 3: Use Resend webhooks to track email events

   **File: `/app/dashboard/email-logs/page.tsx`**
   - Update UI if implementing local email logging
   - Or remove the email logs page entirely

   **Files with template IDs to update:**
   - `/app/dashboard/students/[id]/actions.ts` (Welcome template)
   - `/app/dashboard/students/[id]/sessions/[sessionId]/actions.ts` (Feedback template)
   - `/app/dashboard/leads/actions.ts` (Lead onboarding template)
   - `/app/dashboard/invoices/actions.ts` (Invoice & Payment reminder templates)

5. **Testing Checklist**
   - [ ] Welcome email sends with attachments
   - [ ] Session feedback email sends with formatted markdown
   - [ ] Lead onboarding email sends
   - [ ] Invoice email sends with PDF attachment
   - [ ] Payment reminder email sends
   - [ ] Error handling works correctly
   - [ ] Email logging solution implemented (if keeping feature)

---

### Phase 2: bft-api Repository (COMPLETE)

✅ **Already using Resend** - No action needed!

The bft-api repository is already using Resend for:
- Magic link authentication emails
- Completion notifications

---

### Phase 3: bft-learn Repository (NO ACTION)

No email sending capability - delegates to bft-api.

---

## Resend Template Creation Guide

For each SendGrid template, you'll need to:

1. Log into Resend dashboard
2. Create new template
3. Design email using Resend's template editor
4. Add dynamic variables (use `{{ variable_name }}` syntax)
5. Note the new template ID
6. Update code with new template IDs

### Template Design Recommendations:

- **Maintain brand consistency**: Use Brighter Futures colors/logo
- **Mobile responsive**: Ensure templates work on all devices
- **Plain text versions**: Include for better deliverability
- **Unsubscribe links**: If required by your email policy

---

## Configuration Changes Summary

### Before (SendGrid):
```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@brighterfuturestutoring.com
SENDGRID_ACTIVITY_API_KEY=SG.xxxxx (optional)
SENDGRID_ACTIVITY_BASE_URL=https://api.sendgrid.com/v3/messages
```

### After (Resend):
```env
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@brighterfuturestutoring.com
# SENDGRID variables removed
```

---

## Email Logs Migration Options

SendGrid provides an Activity/Messages API for viewing sent emails. Resend does NOT have an equivalent read API.

### Option 1: Remove Email Logs Feature
- Simplest approach
- Remove `/app/dashboard/email-logs/page.tsx`
- Remove `/lib/email-logs.ts`
- Remove navigation link to email logs

### Option 2: Database Email Logging
- Create `email_logs` table in database
- Log every email sent (to, subject, template_id, sent_at, status)
- Update UI to query local database
- Pros: Full control, queryable history
- Cons: Requires database schema changes

### Option 3: Resend Webhooks
- Set up webhook endpoint to receive email events from Resend
- Store events in database
- Events: `email.sent`, `email.delivered`, `email.bounced`, etc.
- Pros: Real-time status updates, accurate delivery info
- Cons: Most complex to implement

**Recommendation**: Start with Option 1 (remove feature), add Option 2 or 3 later if needed.

---

## Rollback Plan

If issues occur during migration:

1. Revert code changes in `/lib/email.ts`
2. Change environment variables back to SendGrid
3. Redeploy application

Keep SendGrid account active for 30 days after successful migration.

---

## Cost Comparison

### SendGrid Pricing:
- Current plan details needed

### Resend Pricing:
- Free tier: 3,000 emails/month, 100 emails/day
- Pay as you grow: $20/month for 50,000 emails
- No daily sending limit on paid plans

**Action Required**: Estimate monthly email volume to determine Resend plan needed.

---

## Domain Verification

Both SendGrid and Resend require domain verification for best deliverability.

**Action Required**: 
1. Verify sending domain in Resend dashboard
2. Add DNS records (SPF, DKIM, DMARC)
3. Test emails from verified domain

---

## Timeline Estimate

- **Template Creation**: 2-3 hours (5 templates)
- **Code Migration**: 4-6 hours
- **Testing**: 2-3 hours
- **Email Logs Decision**: 1-4 hours (depending on chosen option)
- **Total**: 1-2 days of development work

---

## Questions to Answer Before Migration

1. What is the current monthly email volume?
2. Do we need to keep email logs? If yes, which option (database or webhooks)?
3. Who has access to SendGrid templates to export designs?
4. What is the sender domain and is it already verified?
5. Should we keep SendGrid templates as backup for design reference?
6. What is the rollback threshold (e.g., >5% delivery failure)?

---

## Additional Notes

- **bft-games** repository: Does not send any emails
- All email attachments are currently hosted on Cloudinary
- Consider adding email preview functionality (Resend supports this)
- Test with personal emails first, then limited production test
- Monitor delivery rates closely for first week after migration

---

## Next Steps

1. Review this document with team
2. Answer questions in section above
3. Create Resend account (if not already done)
4. Verify sending domain in Resend
5. Create templates in Resend
6. Begin code migration in development environment
7. Test thoroughly in staging
8. Deploy to production with monitoring
9. Deactivate SendGrid account after 30-day grace period
