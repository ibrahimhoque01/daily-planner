/*
Add event listener
add task to a data structure
display the task to the UI controller
*/


var taskController = (function(){

  var Task = function(id, description){
    this.id = id;
    this.description = description;
  };

  var data = {
    tasks: []
  }


  return{
    addTaskItem: function(description){
      var ID, newTask;


      //The ID will have to be added one everytime to the listener
      //1, 2, 3, 4

      if (data.tasks.length > 0){
        ID = data.tasks[data.tasks.length - 1].id + 1;
      }else{
        ID = 0;
      }

      newTask = new Task(ID, description);

      data.tasks.push(newTask);

      return newTask;

    },

    delTaskItem: function(ID){
      var indexArr, index;

      //YOu have to iterate through the data structure to get the indexes
      indexArr = data.tasks.map(function(current){
        return current.id;
      });


      //then you find if the id matches the current elements
      index = indexArr.indexOf(ID);

      //drop that element from the data structure
        if (index!== -1){
          data.tasks.splice(index, 1);
        }

    },

    checkDataEmp:function(){
      if (data.tasks.length === 0){
        return true;
      }
    },

    clearData:function(){
      data.tasks = [];

    },

    getData:function(){
      return data.tasks;

    },

    testing:function(){
      console.log(data);
    }
  }

})();


var UIController = (function(){

  var DOMStrings = {
    inputDesc: '.add-task',
    element: '.task-section',
    btnClear: '.btn-clear',
    title: '.heading'

  }

  return {

    getValues: function(){//Used method in case of adding more values/input boxes

      return{
          description: document.querySelector(DOMStrings.inputDesc).value
        };

    },

    addTask:function(obj){
      var html, newHtml;

      html = '<div id = task-%id% class="task-item"><p class="task-desc">%description%</p><div class="del-item"><button type="button" class="btn btn-outline-primary btn-sm">X</button></div></div>'

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);

      document.querySelector(DOMStrings.element).style.display = "block";
      document.querySelector(DOMStrings.btnClear).style.display = "block";
      document.querySelector(DOMStrings.element).insertAdjacentHTML('beforeend', newHtml);

    },

    clearFields:function(){
      var field;

      field = document.querySelector(DOMStrings.inputDesc);
      field.value = "";
      field.focus();

    },

    reset:function(){
      document.querySelector(DOMStrings.element).style.display = "none";
      document.querySelector(DOMStrings.btnClear).style.display = "none";
    },

    delTask:function(selectorID, taskDel){

        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);


    },

    setDate:function(){
      var date, day, days, dayMonth,  month, months;
      date = new Date();
      days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      day = date.getDay();
      if (day > 0){
        day = days[day-1];
      }else{
        day = 'Sunday';
      }
      console.log(day)
      dayMonth = date.getDate();
      month = date.getMonth();

      document.querySelector(DOMStrings.title).textContent = 'To Do List - ' + day + ' ' + dayMonth + 'th' + ' ' + months[month];

      // console.log(days[day-1]);
      // console.log(dayMonth);
      // console.log(months[month]);

    },

    clearTasks:function(dataID){
      var taskID;
      dataID.forEach(function(current){
        taskID = 'task-' + current.id;
        UIController.delTask(taskID);
      });
    },

    getDOMStrings:function(){
      return DOMStrings;
    }
  }

})();


var controller = (function(UICtrl, taskCtrl){

  var DOM = UICtrl.getDOMStrings();

  var eventListeners = function(){
    document.querySelector('.btn-add').addEventListener('click', addTask);

    document.addEventListener('keypress', function(event){
      if (event.keycode === 13 || event.which === 13){
        addTask();
      }
    });

    document.querySelector(DOM.element).addEventListener('click', delTask);

    document.querySelector(DOM.btnClear).addEventListener('click', clearAll);

  };

  var clearAll = function(){
    //get tasks = [[1, des], [wd]]
    var delItem, getTasks;

     getTasks = taskCtrl.getData();

     UICtrl.clearTasks(getTasks);
     taskCtrl.clearData();

     controller.innit();


  };


  var delTask = function(event){
    //delete from data structure
    var taskID, checkData;

    taskID = event.target.parentNode.parentNode.id;

    if (taskID){

      id = taskID.split('-');
      taskNo = parseInt(id[1]);

      // delete from data structure
      taskCtrl.delTaskItem(taskNo);

      UICtrl.delTask(taskID);

      checkData = taskCtrl.checkDataEmp();

      if(checkData){
        controller.innit();
      }
    }
  };


  var addTask = function(){


    //User types in description into the the input box
    userValues = UICtrl.getValues();

    if (userValues.description !== ""){
      //Description is passed into data structure to be stored
      newTask = taskCtrl.addTaskItem(userValues.description);

      //Description is displayed onto the UI
      UICtrl.addTask(newTask);

      //Clear input values when task is entered
      UICtrl.clearFields();
    }

  };

  return {
    innit:function(){
      UICtrl.setDate();
      eventListeners();
      UICtrl.reset();
    }
  }


})(UIController, taskController);

controller.innit();
