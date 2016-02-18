Template.finishing.helpers({
  finishingSelection: function(){
    var jobId = Template.instance().data.jobId();
    var job = GetJob(jobId);
    var finishing = null;
    var string = ""
    if (!_.isUndefined(job)) {
      finishing = job.settings.finishing.collate;
      string += finishing.type;
      // string += copiesPages.twoSided ? "Two-Sided" : "Single-Sided" + ", ";
      // string += copiesPages.size + ", ";
      // string += copiesPages.paperColour + ", ";
      // string += copiesPages.type + ", ";
    }
    return string;
  }
});

Template.finishing.events({
  "change .collate": function(event, template){
    var value = $(event.currentTarget).val();
    var jobId = template.data.jobId();
    Jobs.update(jobId, {
      $set: {'settings.finishing.collate.type': value}
    })

    switch (value.toLowerCase()) {
      case 'bind':
        $('.image-selection, .cover-types').hide();
        $('.bind-types').fadeIn();
        $('.cover-types').fadeIn();
        break;
      case 'drill':
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
  }
});
