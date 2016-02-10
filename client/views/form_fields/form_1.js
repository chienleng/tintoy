Template.form1.helpers({
  paperSizes: function() {
    return _.map(PaperSizes, function(size) {
      size.label === 'A4' ? size.selected = 'selected' : size.selected = '';
      return size;
    });
  }
});

Template.form1.events({
  'click .more-settings': function(event) {
    var show = $(event.currentTarget).text() === 'show more settings';
    if (show) {
      // hide
      $(event.currentTarget).text('hide more settings');
      $('.more-settings-fields').fadeIn();
    } else {
      // show
      $(event.currentTarget).text('show more settings');
      $('.more-settings-fields').fadeOut();
    }
    return false;
  },
  'click .image-selection a': function() {
    return false;
  }
});

Template.form1.onCreated(function() {
  this.autorun(function() {
     this.data.job = GetJob(this.data.jobId());
  }.bind(this));
});

Template.form1.onRendered(function() {
  var self = this;
  $('.ui.checkbox').checkbox();
  $('.ui.dropdown').dropdown();
  $('.image-selection').hide();

  $('.collate.ui.dropdown').dropdown({
    onChange: function(value, text, $choice) {
      switch (value) {
        case 'bind':
          $('.image-selection').hide();
          $('.bind-types').fadeIn();
          break;
        case 'drill':
          $('.image-selection').hide();
          break;
        case 'fold':
          $('.image-selection').hide();
          $('.fold-types').fadeIn();
          break;
        case 'staple':
          $('.image-selection').hide();
          break;
        default:
          $('.image-selection').hide();
          console.warn('nothing selected.')
      }
    }
  });
  //
  // setupColorPicker();
  // var picker = new Pikaday({
  //   field: document.getElementById('datepicker'),
  //   format: 'MMM D YYYY',
  //   onSelect: function() {
  //     self.data.job.pickupDate = this.getMoment().toISOString();
  //   }
  // });

});

/* TODO: Branch these out */
function setupColorPicker() {
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
      Session.set('3dColour', color.toHexString());
    }
  });
};
