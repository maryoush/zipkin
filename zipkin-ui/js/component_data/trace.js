import {component} from 'flightjs';
import $ from 'jquery';
import {getError} from '../../js/component_ui/error';
import traceToMustache from '../../js/component_ui/traceToMustache';

export function toContextualLogsUrl(logsUrl, traceId) {
  if (logsUrl) {
    return logsUrl.replace('{traceId}', traceId);
  }
  return logsUrl;
}

export default component(function TraceData() {
  this.after('initialize', function() {
    const traceId = this.attr.traceId;
    const logsUrl = toContextualLogsUrl(this.attr.logsUrl, traceId);
    $.ajax(`/api/v1/trace/${traceId}`, {
      type: 'GET',

      beforeSend(xhr) {
        // console.log('--- before send trace ' + localStorage.getItem('hybris-tenant'));
        xhr.setRequestHeader('hybris-tenant', localStorage.getItem('hybris-tenant'));
      },

      dataType: 'json'
    }).done(trace => {
      const modelview = traceToMustache(trace, logsUrl);
      this.trigger('tracePageModelView', {modelview, trace});
    }).fail(e => {
      this.trigger('uiServerError',
                   getError(`Cannot load trace ${this.attr.traceId}`, e));
    });
  });


  $(window).on('message', e => {
    const orgEvent = e.originalEvent;
    const p = '(http).+(.yaas.io)';
    if (typeof orgEvent.data === 'string' && orgEvent.origin.match(p) !== null) {
      //  console.log('--- r default '+e.originalEvent.data+' '+e.originalEvent.origin);
      if (typeof(Storage) !== 'undefined') {
        const data = e.originalEvent.data;
        localStorage.setItem('hybris-tenant', data);
      }
      //  console.log('--- after received default'+localStorage.getItem("hybris-tenant"));
    }
  });
});
