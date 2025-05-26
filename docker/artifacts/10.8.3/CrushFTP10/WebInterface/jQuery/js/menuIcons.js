function changeMenuIcons(path, hoverPostfix, onMenuStyleBuilding, onContextStyleBuilding){
    //console.log(path, hoverPostfix, onMenuStyleBuilding, onContextStyleBuilding);
    if(path){
        $.get("/WebInterface/jQuery/css/menuIcons.css", function(data){
            var style = data;
            if(style)
            {
                var custStyle = style.replace(/\/WebInterface\/jQuery\/images\/buttonIcons\//g, path);
                $("[_id='customMenuIconsStyle']").remove();
                $("body").append('<style _id="customMenuIconsStyle">'+custStyle+'</style>');
                if(onMenuStyleBuilding)
                {
                    onMenuStyleBuilding(custStyle);
                }
                if(typeof hoverPostfix != "undefined")
                {
                    var hoverStyle = custStyle.replace(/.menuItem/g, ".topnav .menuItem").replace(/A \{/g, "A:hover {").replace(/A, /g, "A:hover, ").replace(/.png/g,hoverPostfix+".png").replace(/\);/g,");");
                    if(onContextStyleBuilding)
                    {
                        hoverStyle += onContextStyleBuilding(hoverStyle);
                    }
                    $("body").append('<style _id="customMenuIconsStyle">'+hoverStyle+'</style>');
                }
            }
        })
    }
}