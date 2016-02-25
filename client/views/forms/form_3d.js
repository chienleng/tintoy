Template.form3D.helpers({
  deliveryTypes: function() {
    var Types = [
      {
        label: 'Pick-up',
        description: ''
      },
      // {
      //   label: 'Courier Delivery',
      //   description: 'Fee: $8 first case, $1 each additional case, allow 5 days'
      // },
      {
        label: 'Campus Mail',
        description: 'NO CHARGE - allow 1-2 days'
      }
    ];
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selected = Types[0].label;

    if (!_.isUndefined(job)) {
      selected = job.settings.delivery;
    }

    return _.map(Types, function(type) {
      type.label === selected ? type.selected = 'checked' : type.selected = '';
      return type;
    });

  },
  customName: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return _.isUndefined(job) ? "" : job.customName;
  },
  additionalInstructions: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    return _.isUndefined(job) ? "" : job.settings.additionalInstructions;
  }
});

Template.form3D.events({
  "change .additional-instructions": function(event, template){
    var jobId = template.data.jobId();
    console.log($(event.currentTarget).val())
    Jobs.update(jobId, {
      $set: {'settings.additionalInstructions': $(event.currentTarget).val()}
    })
  },
  "change .delivery": function(event, template){
    var jobId = template.data.jobId();
    var delivery = $(event.currentTarget).val();
    $('.courier-mail-details, .campus-mail-details').hide();
    // clearAddresses(jobId);
    if (delivery !== 'Pick-up') {
      if (delivery === 'Courier Delivery') {
        $('.courier-mail-details').show();
      } else {
        $('.campus-mail-details').show();
      }
    }
    Jobs.update(jobId, {
      $set: {'settings.delivery': delivery}
    })
  },
  "change .delivery-address input": function(event, template) {
    var jobId = template.data.jobId();
    var address = $(event.currentTarget).val();
    Jobs.update(jobId, {
      $set: {'settings.deliveryAddress': address}
    })
  },
  "change .delivery-address2 input": function(event, template) {
    var jobId = template.data.jobId();
    var address = $(event.currentTarget).val();
    Jobs.update(jobId, {
      $set: {'settings.deliveryAddress2': address}
    })
  },
  "change .delivery-address3 input": function(event, template) {
    var jobId = template.data.jobId();
    var address = $(event.currentTarget).val();
    Jobs.update(jobId, {
      $set: {'settings.deliveryAddress3': address}
    })
  },
  "change .delivery-address4 input": function(event, template) {
    var jobId = template.data.jobId();
    var address = $(event.currentTarget).val();
    Jobs.update(jobId, {
      $set: {'settings.deliveryAddress4': address}
    })
  },
  "change .delivery-address5 input": function(event, template) {
    var jobId = template.data.jobId();
    var address = $(event.currentTarget).val();
    Jobs.update(jobId, {
      $set: {'settings.deliveryAddress5': address}
    })
  },
  "change .delivery-address6 input": function(event, template) {
    var jobId = template.data.jobId();
    var address = $(event.currentTarget).val();
    Jobs.update(jobId, {
      $set: {'settings.deliveryAddress6': address}
    })
  },
  "change .delivery-address7 input": function(event, template) {
    var jobId = template.data.jobId();
    var address = $(event.currentTarget).val();
    console.log('dd')
    Jobs.update(jobId, {
      $set: {'settings.deliveryAddress7': address}
    })
  }
});

Template.form3D.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.form3D.onRendered(function() {
  var self = this;

  setupColorPicker(this.data.jobId());
  $('.courier-mail-details, .campus-mail-details').hide();

  // var picker = new Pikaday({
  //   field: document.getElementById('datepicker'),
  //   format: 'MMM D YYYY',
  //   onSelect: function() {
  //     self.data.job.pickupDate = this.getMoment().toISOString();
  //   }
  // });

});

/* TODO: Branch these out */
function setupColorPicker(jobId) {
  //https://bgrins.github.io/spectrum/#options-showPaletteOnly
  $("#colorpicker").spectrum({
    showPaletteOnly: true,
    showPalette: true,
    hideAfterPaletteSelect: true,
    color: 'dodgerBlue',
    palette: [
      ['dodgerBlue', 'darkred', 'green', 'gray', 'linen', 'orangeRed', 'white']
    ],
    change: function(color) {
      // Session.set('3dColour', color.toHexString());
      Jobs.update(jobId, {
        $set: {'settings.colour': color.toHexString()}
      })
    }
  });
};
