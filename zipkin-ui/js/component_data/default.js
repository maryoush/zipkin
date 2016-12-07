import {component} from 'flightjs';
import {errToStr} from '../../js/component_ui/error';
import $ from 'jquery';
import queryString from 'query-string';
import {traceSummary, traceSummariesToMustache} from '../component_ui/traceSummary';

export function convertToApiQuery(windowLocationSearch) {
  const query = queryString.parse(windowLocationSearch);
  // zipkin's api looks back from endTs
  if (query.startTs) {
    if (query.endTs > query.startTs) {
      query.lookback = String(query.endTs - query.startTs);
    }
    delete query.startTs;
  }
  return query;
}

export default component(function DefaultData() {
  this.after('initialize', function() {
    const query = convertToApiQuery(window.location.search);
    const serviceName = query.serviceName;
    if (serviceName) {
      $.ajax(`/api/v1/traces?${queryString.stringify(query)}`, {
        type: 'GET',
        beforeSend(xhr) {
          //    console.log('--- before send default'+ localStorage.getItem("hybris-tenant"));
          xhr.setRequestHeader('hybris-tenant', localStorage.getItem('hybris-tenant'));
        },

        dataType: 'json'
      }).done(traces => {
        const modelview = {
          traces: traceSummariesToMustache(serviceName, traces.map(traceSummary))
        };
        this.trigger('defaultPageModelView', modelview);
      }).fail(e => {
        this.trigger('defaultPageModelView', {traces: [],
                                              queryError: errToStr(e)});
      });
    } else {
      this.trigger('defaultPageModelView', {traces: []});
    }
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
