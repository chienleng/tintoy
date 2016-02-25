Template.finishing.helpers({
  finishingSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var finishing = null;
    var string = ""
    if (!_.isUndefined(job)) {
      finishing = job.settings.finishing.collate;
      if (finishing.type === 'Bind') {
        string +=  finishing.bind + " binding, ";
      } else if (finishing.type === 'Fold' && !_.isUndefined(finishing.fold)) {
        string += finishing.fold + " fold";
      } else {
        string += finishing.type;
        if (finishing.type === 'Staple') {
          string += ", ";
        }
      }

      if (finishing.type !== "Don't collate" && finishing.type !== "Fold") {
        string += "Front: " + finishing.frontCover + ", ";
        string += "Back: " + finishing.backCover;
      }
    }
    return string;
  },
  finishingTypes: function() {
    var Types = [
      {
        label: 'Don\'t collate'
      },{
        label: 'Bind'
      },{
        label: 'Drill holes'
      },{
        label: 'Fold'
      },{
        label: 'Staple'
      }
    ];
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selected = Types[0].label;

    if (!_.isUndefined(job)) {
      selected = job.settings.finishing.collate.type;
    }

    finishingSelection(selected.toLowerCase());

    return _.map(Types, function(type) {
      type.label === selected ? type.selected = 'selected' : type.selected = '';
      return type;
    });
  },
  bindTypes: function() {
    var bindTypes = Template.instance().data.bindTypes.get();
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selected = bindTypes[0].label;

    if (!_.isUndefined(job)) {
      selected = job.settings.finishing.collate.bind;
    }

    return _.map(bindTypes, function(type) {
      type.label === selected ? type.selected = 'active' : type.selected = '';
      return type;
    });
  },
  foldTypes: function() {
    var foldTypes = Template.instance().data.foldTypes.get();
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selected = foldTypes[0].label;

    if (!_.isUndefined(job) && !_.isUndefined(job.settings.finishing.collate.fold)) {
      selected = job.settings.finishing.collate.fold;
    }

    return _.map(foldTypes, function(type) {
      type.label === selected ? type.selected = 'active' : type.selected = '';
      return type;
    });
  },
  frontCoverColours: function() {
    var Colours = [
      {
        label: 'None'
      },{
        label: 'Clear'
      },{
        label: 'Black'
      },{
        label: 'Blue'
      }
    ];
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selected = Colours[0].label;

    if (!_.isUndefined(job)) {
      selected = job.settings.finishing.collate.frontCover;
    }

    return _.map(Colours, function(type) {
      type.label === selected ? type.selected = 'selected' : type.selected = '';
      return type;
    });
  },
  backCoverColours: function() {
    var Colours = [
      {
        label: 'None'
      },{
        label: 'Clear'
      },{
        label: 'Black'
      },{
        label: 'Blue'
      }
    ];
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selected = Colours[0].label;

    if (!_.isUndefined(job)) {
      selected = job.settings.finishing.collate.backCover;
    }

    return _.map(Colours, function(type) {
      type.label === selected ? type.selected = 'selected' : type.selected = '';
      return type;
    });
  },

});

Template.finishing.events({
  "change .collate": function(event, template){
    var value = $(event.currentTarget).val();
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.finishing.collate.type': value}
    })

    finishingSelection(value.toLowerCase());
  },
  "change .front-cover": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.finishing.collate.frontCover': $(event.currentTarget).val()}
    })
  },
  "change .back-cover": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.finishing.collate.backCover': $(event.currentTarget).val()}
    })
  },
  "click .bind-types a": function(event, template){
    var jobId = template.data.jobId();
    $(".bind-types a").removeClass('active');
    $(event.currentTarget).addClass('active');

    Jobs.update(jobId, {
      $set: {'settings.finishing.collate.bind': $(event.currentTarget).find('.caption').text()}
    })
    return false;
  },
  "click .fold-types a": function(event, template){
    var jobId = template.data.jobId();
    $(".fold-types a").removeClass('active');
    $(event.currentTarget).addClass('active');

    Jobs.update(jobId, {
      $set: {'settings.finishing.collate.fold': $(event.currentTarget).find('.caption').text()}
    })
    return false;
  }
});

Template.finishing.onCreated(function() {
  this.data.foldTypes = new ReactiveVar([
    {
      label: 'Half',
      src: '/img/finishing/fold-half.png'
    },{
      label: 'Letter',
      src: '/img/finishing/fold-letter.png'
    },{
      label: 'Two',
      src: '/img/finishing/fold-two.png'
    }
  ]);

  this.data.bindTypes = new ReactiveVar([
    {
      label: 'Comb',
      src: '/img/finishing/comb.png'
    },{
      label: 'Saddle Stitch',
      src: '/img/finishing/saddle-stitch.png'
    },{
      label: 'Tape',
      src: '/img/finishing/tape.png'
    },{
      label: 'Wire',
      src: '/img/finishing/wire.png'
    }
  ]);
})

function finishingSelection(selection) {
  switch (selection) {
    case 'bind':
      $('.image-selection, .cover-types').hide();
      $('.bind-types').fadeIn();
      $('.cover-types').fadeIn();
      break;
    case 'drill holes':
      $('.image-selection, .cover-types').hide();
      $('.cover-types').fadeIn();
      break;
    case 'fold':
      $('.image-selection, .cover-types').hide();
      $('.fold-types').fadeIn();
      break;
    case 'staple':
      $('.image-selection, .cover-types').hide();
      $('.cover-types').fadeIn();
      break;
    default:
      $('.image-selection, .cover-types').hide();
  }
}
