(function () {
  // 1. Resolve host script and attributes
  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var orgId = script ? script.getAttribute('data-org-id') : null;
  if (!orgId) {
    console.error('[Operator Widget] Missing data-org-id attribute on host script tag.');
    return;
  }

  // Fetch host address to build links
  var hostUrl = new URL(script.src).origin;
  var configUrl = hostUrl + '/api/widget/config?orgId=' + orgId;

  // 2. Fetch widget settings
  fetch(configUrl)
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Verification failed or domain unauthorized');
      }
      return res.json();
    })
    .then(function (data) {
      if (!data.success || !data.settings || !data.settings.enabled) {
        return;
      }
      initWidget(data.settings);
    })
    .catch(function (err) {
      console.warn('[Operator Widget] Initialization skipped:', err.message);
    });

  function initWidget(settings) {
    var isOpen = false;
    var conversationId = localStorage.getItem('nexx_widget_conv_id_' + orgId) || '';

    // Create stylesheet for basic transition animations
    var style = document.createElement('style');
    style.innerHTML =
      '.nexx-widget-container { position: fixed; z-index: 999999; font-family: system-ui, sans-serif; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }' +
      '.nexx-widget-launcher { cursor: pointer; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease; }' +
      '.nexx-widget-launcher:hover { transform: scale(1.06); }' +
      '.nexx-widget-frame-container { overflow: hidden; opacity: 0; pointer-events: none; transform: translateY(20px); border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); border: 1px solid ' + settings.theme.borderColor + '; background: ' + settings.theme.backgroundColor + '; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }' +
      '.nexx-widget-frame-container.open { opacity: 1; pointer-events: auto; transform: translateY(0); }';
    document.head.appendChild(style);

    // Create Container
    var container = document.createElement('div');
    container.className = 'nexx-widget-container';

    // Position Settings
    var isRight = settings.launcher.position !== 'bottom_left';
    container.style.bottom = settings.launcher.spacingY + 'px';
    if (isRight) {
      container.style.right = settings.launcher.spacingX + 'px';
    } else {
      container.style.left = settings.launcher.spacingX + 'px';
    }
    document.body.appendChild(container);

    // Create Frame Container
    var frameContainer = document.createElement('div');
    frameContainer.className = 'nexx-widget-frame-container';
    frameContainer.style.width = settings.customization.widgetWidth + 'px';
    frameContainer.style.height = settings.customization.widgetHeight + 'px';
    frameContainer.style.position = 'absolute';
    frameContainer.style.bottom = '80px';
    if (isRight) {
      frameContainer.style.right = '0';
    } else {
      frameContainer.style.left = '0';
    }

    // Embed Sandbox IFrame
    var iframe = document.createElement('iframe');
    var iframeSrc = hostUrl + '/widget-frame?orgId=' + orgId + '&convId=' + conversationId + '&origin=' + encodeURIComponent(window.location.origin);
    iframe.src = iframeSrc;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    frameContainer.appendChild(iframe);
    container.appendChild(frameContainer);

    // Launcher Design SVG
    var launcherSize = settings.launcher.size === 'small' ? 50 : (settings.launcher.size === 'large' ? 64 : 56);
    var launcher = document.createElement('div');
    launcher.className = 'nexx-widget-launcher';
    launcher.style.width = launcherSize + 'px';
    launcher.style.height = launcherSize + 'px';
    launcher.style.backgroundColor = settings.theme.primaryColor;
    launcher.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + settings.theme.textColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
      '</svg>';
    container.appendChild(launcher);

    // Toggle Handler
    function toggleWidget() {
      isOpen = !isOpen;
      if (isOpen) {
        frameContainer.className = 'nexx-widget-frame-container open';
        launcher.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + settings.theme.textColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"></line>' +
          '<line x1="6" y1="6" x2="18" y2="18"></line>' +
          '</svg>';
        // Track widget open event
        postEvent('widget_open');
      } else {
        frameContainer.className = 'nexx-widget-frame-container';
        launcher.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + settings.theme.textColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
          '</svg>';
      }
    }
    launcher.addEventListener('click', toggleWidget);

    // 3. IFrame Messaging Channels
    window.addEventListener('message', function (event) {
      if (event.origin !== hostUrl) return;

      var type = event.data ? event.data.type : null;
      if (!type) return;

      switch (type) {
        case 'NEXX_SESSION_STARTED':
          var convId = event.data.conversationId;
          localStorage.setItem('nexx_widget_conv_id_' + orgId, convId);
          postEvent('convo_start');
          break;
        case 'NEXX_BOOKING_COMPLETED':
          postEvent('booking_complete', event.data.details);
          break;
        case 'NEXX_LEAD_CAPTURED':
          postEvent('lead_capture', event.data.details);
          break;
        case 'NEXX_TOGGLE':
          toggleWidget();
          break;
      }
    });

    function postEvent(type, data) {
      var sessionId = localStorage.getItem('nexx_widget_sess_id_' + orgId) || '';
      fetch(hostUrl + '/api/widget/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: orgId,
          sessionId: sessionId || null,
          eventType: type,
          eventData: data || null
        })
      }).then(function (res) {
        return res.json();
      }).then(function (resData) {
        if (resData.success && resData.eventId && type === 'convo_start') {
          localStorage.setItem('nexx_widget_sess_id_' + orgId, resData.eventId);
        }
      }).catch(function (e) {
        console.warn('Analytics event log error:', e);
      });
    }

    // 4. Proactive message trigger rules
    if (settings.customization.proactiveTriggers.active) {
      var timeOnPage = settings.customization.proactiveTriggers.timeOnPage || 10;
      setTimeout(function () {
        if (!isOpen) {
          toggleWidget();
        }
      }, timeOnPage * 1000);
    }
  }
})();
