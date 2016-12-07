import {component} from 'flightjs';
import {getError} from '../../js/component_ui/error';
import $ from 'jquery';

export default component(function serviceNames() {
  this.updateServiceNames = function(ev, lastServiceName) {
    $.ajax('api/v1/services', {
      type: 'GET',

      beforeSend(xhr) {
        // console.log('--- bef send updateServiceNames' + localStorage.getItem('hybris-tenant'));
        xhr.setRequestHeader('hybris-tenant', localStorage.getItem('hybris-tenant'));
      },
      dataType: 'json'
    }).done(names => {
      this.trigger('dataServiceNames', {names, lastServiceName});
    }).fail(e => {
      this.trigger('uiServerError', getError('cannot load service names', e));
    });
  };

  $(window).on('message', e => {
    if (typeof e.originalEvent.data === 'string' && typeof(Storage) !== 'undefined') {
      //  console.log('--- r default '+e.originalEvent.data+' '+e.originalEvent.origin);
      const data = e.originalEvent.data;
      localStorage.setItem('hybris-tenant', data);
      //  console.log('--- after received default'+localStorage.getItem("hybris-tenant"));
    }
  });

  this.after('initialize', function() {
    this.on('uiChangeServiceName', this.updateServiceNames);
  });
});
