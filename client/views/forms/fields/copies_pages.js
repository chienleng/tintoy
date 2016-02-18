Template.copiesPages.helpers({
  paperSizes: function() {
    return _.map(PaperSizes, function(size) {
      size.label === 'A4' ? size.selected = 'selected' : size.selected = '';
      return size;
    });
  },
  copiesPagesSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var copiesPages = null;
    var string = ""
    if (!_.isUndefined(job)) {
      copiesPages = job.settings.copiesPages;
      string += copiesPages.copies + (copiesPages.copies > 1 ? " copies" : " copy") + ", ";
      string += copiesPages.twoSided ? "Two-Sided" : "Single-Sided" + ", ";
      string += copiesPages.size + ", ";
      string += copiesPages.paperColour + ", ";
      string += copiesPages.type;
    }
    return string;
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
