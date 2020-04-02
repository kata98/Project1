window.onload = function() {

    var leftItems = [];
    var rightItems = [];
    var newItems = [];

    var flag = false;

    var chbLeft = [];
    var chbRight = [];
    var chbCheck = [];

    getItems();

    document.getElementById('move-right').addEventListener('click', moveRight);
    document.getElementById('move-left').addEventListener('click', moveLeft);
    document.getElementById('send').addEventListener('click', sendPhp);

    function getItems() {

        for (let chb of chbLeft) {
            chbCheck.push(chb);
        }

        $.ajax({
            url: "assets/data/items.json",
            method: "GET",
            success: function(data) {
                for (let d of data) {
                    if (!chbCheck.includes(String(d.id))) {
                        leftItems.push(d);
                    }
                }
                showItems(leftItems);
                chbLeft = [];
                leftItems = [];
                if (flag) {
                    saveRight();
                    flag = false;
                } else {
                    showRightItems(rightItems);
                }
            },
            error: function(error) {
                console.error(error);
            }
        });
    };

    function showItems(data) {
        let ispis = '';
        data.forEach(d => {
            ispis += `<div class='items'>
                <label>
                    <input type="checkbox" data-id="${d.id}" class="chb-left">
                </label>
                <span class='name'>${d.name}</span>
            </div>`
        });
        document.getElementById("items-div").innerHTML = ispis;
    };


    function moveLeft() {

        let chb = document.getElementsByClassName("chb-right");

        for (let c of chb) {
            if (c.checked) {
                chbRight.push(c.getAttribute("data-id"));
            }
        }

        if (chbRight.length == 0) {
            alert("You have not selected an Avenger");
        } else {
            $.ajax({
                url: "assets/data/items.json",
                method: "GET",
                success: function(data) {
                    for (let d of data) {
                        if (chbRight.includes(String(d.id))) {
                            leftItems.push(d);
                        }
                    }
                    flag = true;
                    getItems();
                },
                error: function(error) {
                    console.error(error);
                }
            })
        }
    };

    function moveRight() {

        let chb = document.getElementsByClassName("chb-left");

        for (let c of chb) {
            if (c.checked) {
                chbLeft.push(c.getAttribute("data-id"));

            }
        };

        if (chbLeft.length == 0) {
            alert("You have not selected an Avenger");
        } else {
            $.ajax({
                url: "assets/data/items.json",
                dataType: "json",
                method: "GET",
                success: function(data) {
                    if (rightItems.length > 0) {
                        for (let d of data) {
                            if (chbLeft.includes(String(d.id))) {
                                newItems.push(d);
                            }
                        }
                        getItems();
                        saveRight();
                        showRightItems(newItems);
                    } else {
                        for (let d of data) {
                            if (chbLeft.includes(String(d.id))) {
                                rightItems.push(d);
                            }
                        }
                        getItems();
                        if (flag) {
                            saveRight();
                            flag = false;
                        } else {
                            showRightItems(rightItems);
                        }
                    }
                },
                error: function(xhr, status, error) {
                    console.log(error);
                }

            });
        };

    };

    function showRightItems(data) {
        let ispis = '';
        data.forEach(d => {
            ispis += `<div class='items'>
                <label>
                    <input type="checkbox" data-id="${d.id}" class="chb-right">
                </label>
                <span class='name'>${d.name}</span>
            </div>`
        });

        document.getElementById("moved-div").innerHTML = ispis;
    };

    function saveRight() {
        for (let d of rightItems) {
            if (!chbRight.includes(String(d.id))) {
                newItems.push(d);
            }
        }

        rightItems = newItems;
        showRightItems(rightItems);
        newItems = [];
    };


    function sendPhp() {
        $.ajax({
            url: "obrada.php",
            method: "POST",
            data: {
                itemsArray: rightItems
            },
            success: function(data) {
                alert(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    };


};