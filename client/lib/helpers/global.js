this.JobStatus = {
  PENDING: 'pending', // file in cloud, but job not submitted for printing
  INCOMING: 'incoming', // job submitted
  ACCEPTED: 'accepted', // job accepted by operator
  REJECTED: 'rejected', // job rejected by operator
  DONE: 'done', // job done by operator
  RECEIVED: 'received' // job received by user
}
this.JobType = {
  THREE_D: '3D'
}
this.Account = {
  PERSONAL: 'Personal',
  SHARED: 'Shared',
  PIN: 'PIN'
}
this.ImageTypes = ['image/png', 'image/jpg']; 

this.companyType = {
  EDUCATION: 'Education', // no account selection charges
  CORPORATE: 'Corporate'
}

this.PaperSizes = [
  {
    label: 'A0',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '841',
        h: '1189',
        unit: 'mm'
      }
    }
  },
  {
    label: 'A1',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '594',
        h: '841',
        unit: 'mm'
      }
    }
  },
  {
    label: 'A2',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '420',
        h: '594',
        unit: 'mm'
      }
    }
  },
  {
    label: 'A3',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '297',
        h: '420',
        unit: 'mm'
      }
    }
  },
  {
    label: 'A4',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '210',
        h: '297',
        unit: 'mm'
      }
    }
  },
  {
    label: 'A5',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '148',
        h: '210',
        unit: 'mm'
      }
    }
  },
  {
    label: 'A6',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '105',
        h: '148',
        unit: 'mm'
      }
    }
  },
  {
    label: 'A7',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '74',
        h: '105',
        unit: 'mm'
      }
    }
  },
  {
    label: 'Letter',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '216',
        h: '279',
        unit: 'mm'
      }
    }
  },
  {
    label: 'Legal',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '216',
        h: '356',
        unit: 'mm'
      }
    }
  },
  {
    label: 'Junior Legal',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '127',
        h: '203',
        unit: 'mm'
      }
    }
  },
  {
    label: 'Ledger / Tabloid',
    dimensions: {
      imperial: {
      },
      metric: {
        w: '279',
        h: '432',
        unit: 'mm'
      }
    }
  }
]

this.GetUser = function(userId) {
  return LabUsers.findOne(userId);
};

this.GetJob = function(jobId) {
  return Jobs.findOne(jobId);
};

this.GetAccount = function(accountId) {
  return SharedAccounts.findOne(accountId);
};

this.GetFileByJobId = function(jobId) {
  var job = GetJob(jobId);
  var fileObj = (!_.isUndefined(job) && job.files.length > 0) ? job.files[0] : null; // assume single file
  return fileObj;
};

this.GetLogsByJobId = function(jobId) {
  return JobLogs.find({jobId: jobId}, {sort: {date: -1}});
}

this.AddJobLog = function(jobId, jobStatus, message) {
  var log = {
    jobId: jobId,
    date: new Date(),
    status: jobStatus,
    message: message
  }
  var jobLogId = JobLogs.insert(log);
  Jobs.update(jobId, {$set: {latestLog: JobLogs.findOne(jobLogId)}});
}

// for auto incrementing jobNum
this.GetNextSequence = function(name) {
  try {
    Counters.update(name, {$inc: {seq: 1}});
    return Counters.findOne(name).seq;
  } catch (e) {
    console.error("getNextSequence", e.message);
  }
};

// Randomly pulse the logo.
Meteor.setInterval(function(){
   $('.pc-logo').transition('pulse');
}, Math.floor(Math.random() * (240000 - 120000 + 1)) + 120000);
