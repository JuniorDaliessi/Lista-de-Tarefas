// Este código opcional é usado para registrar um service worker.
// register() não é chamado por padrão.

// Isso permite que o aplicativo carregue mais rápido em visitas subsequentes na produção e dá
// capacidades offline. No entanto, também significa que os desenvolvedores (e usuários)
// só verão atualizações implantadas na visita subsequente à página, após todas
// as guias existentes da página abertas terem sido fechadas, já que os caches
// anteriormente armazenados são atualizados em segundo plano.

// Para saber mais sobre os benefícios deste modelo e instruções sobre como
// aceitar ou não este comportamento, acesse https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] é o endereço IPv6 localhost.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 são considerados localhost para IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    // O construtor URL está disponível em todos os navegadores que suportam SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Nosso service worker não funcionará se PUBLIC_URL estiver em uma origem diferente
      // da nossa página. Isso pode acontecer se um CDN for usado para
      // servir assets; consulte https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Isso está sendo executado no localhost. Vamos verificar se um service worker ainda existe ou não.
        checkValidServiceWorker(swUrl, config);

        // Adicionar alguns logs adicionais relacionados ao service worker local.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Este aplicativo web está sendo servido em cache primeiro por um ' +
              'service worker. Para saber mais, visite https://cra.link/PWA'
          );
        });
      } else {
        // Não é localhost. Apenas registrar o service worker
        registerValidSW(swUrl, config);
      }
    });

    // Adicionando um listener para o status de conexão online/offline
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Verificar status inicial
    if (!navigator.onLine) {
      document.body.classList.add('offline-mode');
      showOfflineMessage(true);
    }
  }
}

function handleConnectionChange() {
  if (navigator.onLine) {
    document.body.classList.remove('offline-mode');
    showOfflineMessage(false);
  } else {
    document.body.classList.add('offline-mode');
    showOfflineMessage(true);
  }
}

function showOfflineMessage(show: boolean) {
  const existingMessage = document.getElementById('offline-message');
  
  if (show && !existingMessage) {
    const message = document.createElement('div');
    message.id = 'offline-message';
    message.innerHTML = 'Você está offline. As alterações serão sincronizadas quando você reconectar.';
    message.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--warning-color, #ff9800);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      text-align: center;
      animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(message);
  } else if (!show && existingMessage) {
    existingMessage.remove();
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Neste ponto, o service worker atualizado assumiu o controle, 
              // mas o conteúdo anterior ainda será exibido até que todas as
              // guias da página sejam fechadas.
              console.log(
                'Novo conteúdo está disponível e será usado quando todas ' +
                  'as guias desta página forem fechadas. Consulte https://cra.link/PWA.'
              );

              // Executar callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Neste ponto, tudo foi pré-carregado.
              console.log('O conteúdo está armazenado em cache para uso offline.');

              // Executar callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Erro durante o registro do service worker:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Verificar se o service worker pode ser encontrado. Se não puder, recarregue a página.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Verifique se o service worker existe e se realmente estamos obtendo um arquivo JS.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Nenhum service worker encontrado. Provavelmente um aplicativo diferente. Recarregue a página.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker encontrado. Proceda normalmente.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Nenhuma conexão de internet encontrada. O aplicativo está sendo executado no modo offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
} 