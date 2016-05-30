Template.copiesPages.helpers({
  paperSizes: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var paperSize = 'A4';

    if (!_.isUndefined(job)) {
      paperSize = job.settings.copiesPages.size;
    }

    console.log(paperSize)
    return _.map(PaperSizes, function(size) {
      size.label === paperSize ? size.selected = 'selected' : size.selected = '';
      return size;
    });
  },
  paperColours: function() {
    var Colours = [
      {
        label: 'White',
        hex: '#FFFFFF'
      },{
        label: 'Red',
        hex: '#FF0000'
      },{
        label: 'Blue',
        hex: '#0000FF'
      }
    ];
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selectedColour = Colours[0].label;

    if (!_.isUndefined(job)) {
      selectedColour = job.settings.copiesPages.paperColour;
    }

    return _.map(Colours, function(colour) {
      colour.label === selectedColour ? colour.selected = 'selected' : colour.selected = '';
      return colour;
    });
  },
  paperTypes: function() {
    var Types = [
      {
        label: 'Normal',
        weight: '(80 gsm)'
      },{
        label: 'Gloss',
        weight: '(80 gsm)'
      },{
        label: 'Heavy Duty',
        weight: '(120 gsm)'
      }
    ];
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var selected = Types[0].label;

    if (!_.isUndefined(job)) {
      selected = job.settings.copiesPages.type;
    }

    return _.map(Types, function(type) {
      type.label === selected ? type.selected = 'selected' : type.selected = '';
      return type;
    });
  },
  selectedJob: function() {
    var jobId = Template.instance().data.jobId();
    return GetJob(jobId);
  },
  twoSidedChecked: function() {
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var checked = "";
    if (!_.isUndefined(job)) {
      copiesPages = job.settings.copiesPages;
      if (copiesPages.twoSided) {
        checked = "checked"
      }
    }
    return checked
  },
  copiesPagesSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var copiesPages = null;
    var string = ""
    if (!_.isUndefined(job)) {
      copiesPages = job.settings.copiesPages;
      string += copiesPages.copies + (copiesPages.copies > 1 ? " copies" : " copy") + ", ";
      string += (copiesPages.twoSided ? "Two-Sided" : "Single-Sided") + ", ";
      string += copiesPages.size + ", ";
      string += copiesPages.paperColour + ", ";
      string += copiesPages.type;
    }
    return string;
  },
  copiesPagesPrice: function() {
    return "$1.45 per page"
  }
});

Template.copiesPages.events({
  "change .field-copies": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.copiesPages.copies': $(event.currentTarget).val()}
    })
  },
  "change .field-two-sided": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.copiesPages.twoSided': $(event.currentTarget).prop('checked')}
    })
  },
  "change .paper-size": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.copiesPages.size': $(event.currentTarget).val()}
    })
  },
  "change .paper-colour": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.copiesPages.paperColour': $(event.currentTarget).val()}
    })
  },
  "change .paper-type": function(event, template){
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.copiesPages.type': $(event.currentTarget).val()}
    })
  }
});

Template.copiesPages.onRendered(function() {
  console.log(this.data.jobId());

  // this.autorun(function() {
  // }.bind(this))
});
