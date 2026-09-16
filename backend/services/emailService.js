import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || "orders@viaclothing.in";
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendMail({ to, subject, html, text }) {
    if (!this.transporter) {
      console.log(`[Email Service (Dev Log)] To: ${to} | Subject: ${subject}`);
      return { success: true, mocked: true };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"VIA Clothing" <${this.fromEmail}>`,
        to,
        subject,
        text,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[Email Service] Failed to send email to ${to}:`, err.message);
      return { success: false, error: err.message };
    }
  }

  async sendWelcomeEmail(user) {
    const subject = "Welcome to the VIA Movement — Vibe • Identity • Authenticity";
    const html = `
      <div style="background-color: #09090b; color: #ffffff; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; padding: 32px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 8px;">VIA</h1>
          <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Vibe • Identity • Authenticity</p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 24px 0;" />
          <h2 style="color: #ffffff; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Welcome, ${user.name}</h2>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">Your account has been created. You now have exclusive early access to heavy-GSM capsule drops, private streetwear releases, and seamless order tracking.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/shop" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; display: inline-block;">Explore Collection</a>
          </div>
          <p style="color: #71717a; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-top: 30px;">Define Your Own. Never Conform.</p>
        </div>
      </div>
    `;
    return this.sendMail({ to: user.email, subject, html });
  }

  async sendOrderConfirmationEmail(order, user) {
    const subject = `Order Confirmed: ${order.orderNumber} — VIA Luxury Streetwear`;
    const itemsList = order.items
      .map(
        (i) => `
        <tr style="border-bottom: 1px solid #27272a;">
          <td style="padding: 12px 0; color: #ffffff; font-size: 13px;">${i.name} (Size: ${i.size})</td>
          <td style="padding: 12px 0; color: #a1a1aa; font-size: 13px; text-align: center;">x${i.quantity}</td>
          <td style="padding: 12px 0; color: #ffffff; font-size: 13px; text-align: right;">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
        </tr>`
      )
      .join("");

    const html = `
      <div style="background-color: #09090b; color: #ffffff; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; padding: 32px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 4px;">VIA</h1>
          <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Order Confirmation</p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
          <p style="color: #e4e4e7; font-size: 14px;">Thank you for your order, <strong>${user.name}</strong>. Your streetwear pieces are being packed for express courier dispatch.</p>
          <div style="background-color: #18181b; padding: 16px; border: 1px solid #27272a; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
            <p style="margin: 4px 0 0; font-size: 16px; font-weight: bold; color: #ffffff;">${order.orderNumber}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="border-bottom: 1px solid #3f3f46; text-align: left;">
                <th style="padding-bottom: 8px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                <th style="padding-bottom: 8px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <div style="text-align: right; border-top: 1px solid #3f3f46; padding-top: 12px; font-size: 14px;">
            <p style="margin: 4px 0; color: #a1a1aa;">Subtotal: <span style="color: #ffffff;">₹${order.subtotal.toLocaleString("en-IN")}</span></p>
            ${order.discount ? `<p style="margin: 4px 0; color: #10b981;">Discount: -₹${order.discount.toLocaleString("en-IN")}</p>` : ""}
            <p style="margin: 4px 0; color: #a1a1aa;">Shipping: <span style="color: #ffffff;">${order.shippingFee === 0 ? "FREE" : "₹" + order.shippingFee}</span></p>
            <p style="margin: 8px 0 0; font-size: 18px; font-weight: 900; color: #ffffff;">Total: ₹${order.total.toLocaleString("en-IN")}</p>
          </div>
          <div style="margin: 32px 0 0;">
            <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/account/orders/${order._id}" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; display: inline-block;">Track Your Order</a>
          </div>
        </div>
      </div>
    `;
    return this.sendMail({ to: user.email, subject, html });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/reset-password/${resetToken}`;
    const subject = "Reset Your VIA Account Password";
    const html = `
      <div style="background-color: #09090b; color: #ffffff; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; padding: 32px;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 4px;">VIA</h1>
          <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Password Reset Request</p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
          <p style="color: #e4e4e7; font-size: 14px;">You requested a password reset for your VIA account. Click the button below to choose a new password. This link is valid for 1 hour.</p>
          <div style="margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #ffffff; color: #000000; padding: 14px 28px; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #71717a; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
        </div>
      </div>
    `;
    return this.sendMail({ to: user.email, subject, html });
  }

  async sendOtpEmail(user, otp) {
    const subject = `${otp} is your VIA Account Verification Code`;
    const html = `
      <div style="background-color: #09090b; color: #ffffff; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 4px;">VIA</h1>
          <p style="color: #a1a1aa; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Email Verification</p>
          <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
          <h2 style="color: #ffffff; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Verify Your Email Address</h2>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">Hello ${user.name || "Customer"}, use the verification code below to verify your email address. This code is valid for 10 minutes.</p>
          <div style="background-color: #18181b; border: 1px solid #3f3f46; border-radius: 4px; padding: 20px; margin: 24px auto; display: inline-block;">
            <span style="color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: 8px; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #71717a; font-size: 12px; margin-top: 24px;">If you did not attempt to sign up for VIA Clothing, you can safely ignore this email.</p>
          <p style="color: #71717a; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-top: 30px;">Define Your Own. Never Conform.</p>
        </div>
      </div>
    `;
    return this.sendMail({
      to: user.email,
      subject,
      html,
      text: `Your VIA verification code is ${otp}. It expires in 10 minutes.`,
    });
  }
}

export default new EmailService();
