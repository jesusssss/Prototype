function toast(message, placement, duration) {
     message = typeof message !== 'undefined' ? message : 'NO_TEXT';
     duration = typeof duration !== 'undefined' ? duration : 'long';
     placement = typeof placement !== 'undefined' ? placement : 'bottom';

    window.plugins.toast.show(message, duration, placement);
}