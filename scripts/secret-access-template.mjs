export const secretAccessHtml = `<style id="paunova-secret-access-style">
#paunova-secret-trigger {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 2147483640;
  width: 46px;
  height: 46px;
  border-radius: 9999px;
  border: 1px solid rgba(197, 168, 128, 0.68);
  background: rgba(251, 249, 248, 0.82) url('/logo_secreto.jpg') center / cover no-repeat;
  box-shadow: 0 18px 44px -26px rgba(38, 25, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.72);
  cursor: pointer;
  opacity: 0.64;
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-tap-highlight-color: transparent;
}

#paunova-secret-trigger:hover,
#paunova-secret-trigger:focus-visible {
  opacity: 1;
  outline: none;
  transform: translateY(-1px) scale(1.06);
  box-shadow: 0 22px 52px -24px rgba(38, 25, 0, 0.82), 0 0 0 4px rgba(197, 168, 128, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

#paunova-secret-trigger:active {
  transform: scale(0.96);
}

#paunova-secret-modal[hidden] {
  display: none;
}

#paunova-secret-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483641;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(27, 28, 28, 0.42);
  backdrop-filter: blur(18px);
}

.paunova-secret-panel {
  width: min(440px, 100%);
  border: 1px solid rgba(210, 196, 187, 0.62);
  border-radius: 30px;
  background: rgba(253, 251, 247, 0.96);
  box-shadow: 0 36px 90px -42px rgba(38, 25, 0, 0.88), inset 0 1px 0 rgba(255, 255, 255, 0.86);
  padding: 30px;
  color: #1b1c1c;
  font-family: Hanken Grotesk, Arial, sans-serif;
}

.paunova-secret-brand {
  display: block;
  width: min(300px, 100%);
  height: auto;
  margin: 0 auto 18px;
  filter: drop-shadow(0 18px 24px rgba(109, 88, 71, 0.18));
}

.paunova-secret-eyebrow {
  margin: 0 0 8px;
  color: #88705e;
  font-family: Sora, Arial, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-align: center;
  text-transform: uppercase;
}

.paunova-secret-title {
  margin: 0 0 24px;
  color: #6d5847;
  font-family: EB Garamond, Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 1;
  text-align: center;
}

.paunova-secret-field {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.paunova-secret-field label {
  color: #6d5847;
  font-family: Sora, Arial, sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.paunova-secret-field input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(210, 196, 187, 0.78);
  border-radius: 14px;
  background: #ffffff;
  color: #1b1c1c;
  font: inherit;
  padding: 14px 15px;
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.paunova-secret-field input:focus {
  border-color: #6d5847;
  box-shadow: 0 0 0 4px rgba(109, 88, 71, 0.1);
}

.paunova-secret-error {
  min-height: 18px;
  margin: 2px 0 16px;
  color: #b42318;
  font-size: 12px;
  line-height: 1.45;
}

.paunova-secret-actions {
  display: flex;
  gap: 10px;
}

.paunova-secret-submit,
.paunova-secret-close {
  min-height: 46px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-family: Sora, Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: transform 180ms ease, background-color 180ms ease, opacity 180ms ease;
}

.paunova-secret-submit {
  flex: 1;
  background: #6d5847;
  color: #fdfbf7;
}

.paunova-secret-close {
  width: 112px;
  background: rgba(197, 168, 128, 0.14);
  color: #6d5847;
}

.paunova-secret-submit:hover,
.paunova-secret-close:hover {
  transform: translateY(-1px);
}

.paunova-secret-submit:disabled {
  cursor: wait;
  opacity: 0.58;
  transform: none;
}

@media (max-width: 640px) {
  #paunova-secret-trigger {
    top: 14px;
    right: 14px;
    width: 44px;
    height: 44px;
    opacity: 0.72;
  }

  .paunova-secret-panel {
    padding: 24px;
    border-radius: 24px;
  }

  .paunova-secret-brand {
    width: min(260px, 100%);
  }
}
</style>
<button id="paunova-secret-trigger" type="button" aria-label="Abrir portal privado" title="Portal privado"></button>
<div id="paunova-secret-modal" hidden aria-hidden="true">
  <div class="paunova-secret-panel" role="dialog" aria-modal="true" aria-labelledby="paunova-secret-title">
    <img class="paunova-secret-brand" src="/brand-assets/logo-paunova-skin-age.png" alt="Paunova Skin & Age Clinic" />
    <p class="paunova-secret-eyebrow">Portal médico privado</p>
    <h2 class="paunova-secret-title" id="paunova-secret-title">Acceso clínico</h2>
    <form id="paunova-secret-form">
      <div class="paunova-secret-field">
        <label for="paunova-secret-user">Usuario</label>
        <input id="paunova-secret-user" name="username" type="text" autocomplete="username" required />
      </div>
      <div class="paunova-secret-field">
        <label for="paunova-secret-password">Clave</label>
        <input id="paunova-secret-password" name="password" type="password" autocomplete="current-password" required />
      </div>
      <p class="paunova-secret-error" id="paunova-secret-error" aria-live="polite"></p>
      <div class="paunova-secret-actions">
        <button class="paunova-secret-submit" type="submit">Conectar</button>
        <button class="paunova-secret-close" type="button">Cerrar</button>
      </div>
    </form>
  </div>
</div>
<script>
(function() {
  const trigger = document.getElementById('paunova-secret-trigger');
  const modal = document.getElementById('paunova-secret-modal');
  const form = document.getElementById('paunova-secret-form');
  const closeButton = modal ? modal.querySelector('.paunova-secret-close') : null;
  const usernameInput = document.getElementById('paunova-secret-user');
  const passwordInput = document.getElementById('paunova-secret-password');
  const errorNode = document.getElementById('paunova-secret-error');
  const submitButton = modal ? modal.querySelector('.paunova-secret-submit') : null;

  if (!trigger || !modal || !form || !closeButton || !usernameInput || !passwordInput || !errorNode || !submitButton) return;

  function openModal(event) {
    if (event) event.preventDefault();
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    errorNode.textContent = '';
    setTimeout(function() { usernameInput.focus(); }, 40);
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
    errorNode.textContent = '';
  }

  trigger.addEventListener('click', openModal);
  trigger.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') openModal(event);
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', function(event) {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    errorNode.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Conectando';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: usernameInput.value.trim(),
          password: passwordInput.value
        })
      });
      const data = await response.json().catch(function() { return {}; });

      if (!response.ok || !data.success) {
        errorNode.textContent = data.error || 'No fue posible conectar con la aplicación. Revisa el usuario y la clave.';
        return;
      }

      window.top.location.assign('/doctor/dashboard');
    } catch {
      errorNode.textContent = 'No fue posible conectar con la aplicación. Intenta nuevamente.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Conectar';
    }
  });
})();
</script>`;
