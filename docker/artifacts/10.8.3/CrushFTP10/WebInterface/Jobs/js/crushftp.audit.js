var audit = {
    log: {},
    getName: function(obj){
        obj = obj || {};
        var type = obj.type || "";
        var id = obj.id || obj.connectionID || "";
        var name = obj.name || "";
        if(type || id || name)
            return name + "("+type+"/"+id+")";
        return "";
    },
    skipEntry: false,
    template: '{time}|{user}|{job}: {message}',
    getMsg: function(time, user, job, message){
        return audit.template.replace(/{time}/g, dateFormat(time, "yyyy-mm-dd HH:MM:ss")).replace(/{user}/g, user).replace(/{job}/g, job).replace(/{message}/g, message);
    },
    addLog: function(message){
        if(!taskDesigner.audit_job_logs){
            return;
        }
        var currentJob = taskDesigner.loadedSchedule;
        if(!currentJob || audit.skipEntry)return;
        taskDesigner.getServerTime(function(time){
            var curTime = parseInt(time);
            var dtTime = new Date(curTime);
            var jobName = currentJob.scheduleName;
            var jobID = currentJob.id;
            var curTime = dtTime.getTime();
            var currentUser = crushFTP.storage("username");
            audit.log[jobID] = audit.log[jobID] || [];
            var entry = audit.getMsg(curTime, currentUser, jobName, message);
            audit.log[jobID].push(entry);
        });
    },
    clearLog: function(key){
        audit.log[key] = [];
    },
    getLog: function(key){
        audit.log[key] = audit.log[key] || [];
        return audit.log[key].join("\n");
    }
};