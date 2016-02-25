Template.delivery.helpers({
  deliverySelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var string = "";

    if (!_.isUndefined(job)) {
      string += job.settings.delivery;
      if (job.settings.delivery === "Courier Delivery") {
        string += ": " + job.settings.deliveryAddress3;
        if (job.settings.deliveryAddress4 !== "") {
          string += " " + job.settings.deliveryAddress4;
        }
        string += ", " + job.settings.deliveryAddress5 + ", " + job.settings.deliveryAddress6 + " " + job.settings.deliveryAddress7;
      } else if (job.settings.delivery === "Campus Mail") {
        string += ": " + job.settings.deliveryAddress + " — " + job.settings.deliveryAddress2;
      }
    }
    return string;
  },
  deliveryTypes: function() {
    var Types = [
      {
        label: 'Pick-up',
        description: ''
      },{
        label: 'Courier Delivery',
        description: 'Fee: $8 first case, $1 each additional case, allow 5 days'
      },{
        label: 'Campus Mail',
        description: 'NO CHARGE - size/weight restrictions, allow 1-2 days'
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

  }
});
Template.delivery.events({
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

Template.delivery.onRendered(function() {
  $('.courier-mail-details, .campus-mail-details').hide();
})

function clearAddresses(jobId) {
  console.log(jobId)
  Jobs.update(jobId, {
    $set: {'settings.deliveryAddress': ""}
  });
  Jobs.update(jobId, {
    $set: {'settings.deliveryAddress2': ""}
  })
  Jobs.update(jobId, {
    $set: {'settings.deliveryAddress3': ""}
  })
  Jobs.update(jobId, {
    $set: {'settings.deliveryAddress4': ""}
  })
  Jobs.update(jobId, {
    $set: {'settings.deliveryAddress5': ""}
  })
  Jobs.update(jobId, {
    $set: {'settings.deliveryAddress6': ""}
  })
  Jobs.update(jobId, {
    $set: {'settings.deliveryAddress7': ""}
  })

}
