function resetPasswordTemplate(resetUrl) {
  return `
      <div style="
    margin: 0;
    padding: 40px 20px;
    background-color: #f4f4f5;
    font-family: Arial, sans-serif;
  ">
    <div style="
      max-width: 500px;
      margin: 0 auto;
      padding: 40px;
      background-color: #ffffff;
      border-radius: 12px;
      text-align: center;
    ">
      <h1 style="
        margin-bottom: 24px;
        color: #18181b;
      ">
        Réinitialisez votre mot de passe
      </h1>

      <p style="
        margin-bottom: 16px;
        color: #52525b;
        font-size: 16px;
        line-height: 1.6;
      ">
        Vous venez de demander une réinitialisation de votre mot de passe.
      </p>

      <p style="
        margin-bottom: 30px;
        color: #52525b;
        font-size: 16px;
        line-height: 1.6;
      ">
        Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
      </p>

      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          padding: 14px 24px;
          background-color: #18181b;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
        "
      >
        Réinitialiser mon mot de passe
      </a>

      <p style="
        margin-top: 30px;
        color: #71717a;
        font-size: 13px;
        line-height: 1.5;
      ">
        Ce lien expirera dans 1 heure.
      </p>
    </div>
  </div>
    `;
}

export default resetPasswordTemplate;
