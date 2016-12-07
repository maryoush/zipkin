import {component} from 'flightjs';
import $ from 'jquery';
import {getError} from '../../js/component_ui/error';
import traceToMustache from '../../js/component_ui/traceToMustache';

export default component(function TraceData() {
  this.after('initialize', function() {
    $.ajax(`api/v1/trace/${this.attr.traceId}`, {
      type: 'GET',

      beforeSend(xhr) {
        // console.log('--- before send trace ' + localStorage.getItem('hybris-tenant'));
        xhr.setRequestHeader('hybris-tenant', localStorage.getItem('hybris-tenant'));
      },

      dataType: 'json'
    }).done(trace => {
      const modelview = traceToMustache(trace);
      this.trigger('tracePageModelView', {modelview, trace});
    }).fail(e => {
      this.trigger('uiServerError',
                   getError(`Cannot load trace ${this.attr.traceId}`, e));
    });
  });


  $(window).on('message', e => {
    if (typeof e.originalEvent.data === 'string' && typeof(Storage) !== 'undefined') {
      //  console.log('--- r default '+e.originalEvent.data+' '+e.originalEvent.origin);
      const data = e.originalEvent.data;
      localStorage.setItem('hybris-tenant', data);
      //  console.log('--- after received default'+localStorage.getItem("hybris-tenant"));
    }
  });
});
