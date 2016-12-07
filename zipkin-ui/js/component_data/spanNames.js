import {component} from 'flightjs';
import {getError} from '../../js/component_ui/error';
import $ from 'jquery';

export default component(function spanNames() {
  this.updateSpanNames = function(ev, serviceName) {
    $.ajax(`api/v1/spans?serviceName=${serviceName}`, {
      type: 'GET',
      beforeSend(xhr) {
        // console.log('--- before send updateSpanNames ' + localStorage.getItem('hybris-tenant'));
        xhr.setRequestHeader('hybris-tenant', localStorage.getItem('hybris-tenant'));
      },
      dataType: 'json'
    }).done(spans => {
      this.trigger('dataSpanNames', {spans});
    }).fail(e => {
      this.trigger('uiServerError', getError('cannot load span names', e));
    });

    $(window).on('message', e => {
      if (typeof e.originalEvent.data === 'string' && typeof(Storage) !== 'undefined') {
      //  console.log('--- r default '+e.originalEvent.data+' '+e.originalEvent.origin);
        const data = e.originalEvent.data;
        localStorage.setItem('hybris-tenant', data);
      //  console.log('--- after received default'+localStorage.getItem("hybris-tenant"));
      }
    });
  };


  this.after('initialize', function() {
    this.on('uiChangeServiceName', this.updateSpanNames);
  });
});
