/*
 * Vaultic website configuration — SINGLE SOURCE OF TRUTH.
 *
 * Every "Download on the App Store" button, Pro CTA, and footer link on this
 * site reads `appStoreId` from here. It is set to the live Vaultic listing, so
 * every link resolves; the guard below stays in place so that blanking or
 * corrupting the value disables the links visibly instead of shipping dead
 * ones.
 *
 * The value is the App Store Connect "Apple ID" (App Information → Apple ID),
 * digits only. Changing it repoints the entire site.
 */
window.VAULTIC_CONFIG = {
  // Live Vaultic listing. Digits only, no "id" prefix.
  appStoreId: "6763950462",

  // Shown in the footer and on the support page.
  supportEmail: "support@vaulticapp.com",
};

(function () {
  "use strict";

  var cfg = window.VAULTIC_CONFIG;
  var configured = /^\d{9,10}$/.test(cfg.appStoreId);

  cfg.appStoreUrl = configured
    ? "https://apps.apple.com/app/id" + cfg.appStoreId
    : null;

  document.addEventListener("DOMContentLoaded", function () {
    // Every App Store link on the site is marked `data-appstore-link`.
    var links = document.querySelectorAll("[data-appstore-link]");

    Array.prototype.forEach.call(links, function (el) {
      if (configured) {
        el.setAttribute("href", cfg.appStoreUrl);
        return;
      }
      // Not configured: make it visibly inert rather than silently dead, so a
      // missing ID can't ship unnoticed.
      el.setAttribute("href", "#");
      el.setAttribute("aria-disabled", "true");
      el.style.opacity = "0.55";
      el.style.cursor = "not-allowed";
      el.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-support-email]"),
      function (el) {
        el.setAttribute("href", "mailto:" + cfg.supportEmail);
        if (el.hasAttribute("data-support-email-text")) {
          el.textContent = cfg.supportEmail;
        }
      }
    );

    if (!configured) {
      var banner = document.createElement("div");
      banner.setAttribute("role", "status");
      banner.style.cssText =
        "position:fixed;left:0;right:0;bottom:0;z-index:9999;" +
        "background:#7f1d1d;color:#fff;font:600 13px/1.5 -apple-system," +
        "BlinkMacSystemFont,'Segoe UI',sans-serif;padding:10px 16px;" +
        "text-align:center;";
      banner.textContent =
        "Setup incomplete: App Store ID not configured. " +
        "Set appStoreId in assets/config.js — App Store links are disabled.";
      document.body.appendChild(banner);
    }
  });
})();
