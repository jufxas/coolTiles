let buttonHandler = {
    configs: false, 
    dimensions: false, 
    colors: false, 
    transColor: false,
    dimensionsInfo: false,
    generalInfo: false, 
    colorsInfo: false,
    transColorInfo: false
}
let smallSquares = [];
let squareConfigs = {
    dimensions: {x: 10, y: 10, w:10, h: 10}, // 25 25 10 10 
    horizontalRows: 20, // dimension 
    verticalColumns: 20,  // dimension 5 by 5 
    numberOfSquares: 1, // for proj, d: 25,10,10,10. numsqr 196, spacing  10
    spacingBetweenSquaresX: 10, // 10, 10
    spacingBetweenSquaresY: 10,
    colors: {r: 255, g: 255, b: 255},
    transformationTime: 100, 
    frameRate: 15,
    showText: false, 
    transformationColor: {r: 'random', g: 'random', b:'random', special: "ANY-2"} // special can be RANDOM_ALL, ONLY-R, ONLY-G, ONLY-B, RANDOM-R, RANDOM-G, RANDOM-B, RANDOM-RG, RANDOM-GB. CAN ALSO CHAIN LIKE ONLY-R RANDOM-R. IF U DO SOMETHING LIKE "ONLY-R RANDOM-G" UR JUST GONNA BREAK IT. 
    // So heres the difference: For transformation color, r,g,b that is its constant transformation color. If you set it a transf color to 'random' then it will be a random color (0 to 255) but still have the same r value across all squares. if you have the special set to RANDOM-R, then the R value will constantly change across all squares. 
    // RAINBOW - u get rainbow wow ! overrides all other commands 
    // NOTE THAT SPECIAL SETTINGS OVERRIDE TRANSF COL OPTIONS. ONLY-() IS MOST POWERFUL. DOING RANDOM-RG AND ONLY-R WILL STILL JUST BE ONLY-R RANDOM-R
    // ANY-1 - randomly chooses from special based off hard coded combinations and sticks with it 
    // ANY-2 - constantly changing
}

// default values meant to be overridden 
let savedValues = {
    dimensions: {x: 10,y: 10,w: 10,h: 10
        },horizontalRows: 20,verticalColumns: 20,numberOfSquares: 1,spacingBetweenSquaresX: 10, spacingBetweenSquaresY: 10, colors: {r: 255,g: 255,b: 255},transformationTime: 100,frameRate: 15,showText: false,transformationColor: {r: 'random',g: 'random',b: 'random',special: "ANY-2"}
} 

// FOR RAINBOW GRAD 
let color = {
    r: 255,
    g: 0,
    b: 0,
    reset() {
        this.r = 255;
        this.g = 0;
        this.b = 0;
    }
}
let rateOfIncrOrDecr = 1; // anything beyond 5 = broke 
// FOR RAINBOW GRAD

function setConstants() {
    squareConfigs.constantValues = {
        x: squareConfigs.dimensions.x,
        y: squareConfigs.dimensions.y,
        w: squareConfigs.dimensions.w,
        h: squareConfigs.dimensions.h,

        actuallyConstantX: squareConfigs.dimensions.x,
        actuallyConstantY: squareConfigs.dimensions.y,
        actuallyConstantW: squareConfigs.dimensions.w,
        actuallyConstantH: squareConfigs.dimensions.h,
        colors: {r: squareConfigs.colors.r, g: squareConfigs.colors.g, b: squareConfigs.colors.b},
        transformationColor: {r: squareConfigs.transformationColor.r, g: squareConfigs.transformationColor.g, b: squareConfigs.transformationColor.b, special: squareConfigs.transformationColor.special}
    }
}
setConstants()

let wholeSquareHolder = [];
class WholeSquare {
    constructor (sqr) {
        this.sqr = sqr; 
    }
}



function setup () {
    let mainCanvas = createCanvas (700, 700);
    mainCanvas.parent("p5Holder")
    frameRate (squareConfigs.frameRate);

    const buttonTimer = ms => new Promise(res => setTimeout(res, ms));
    $("button#openConfigs").click(function () {
        // OPEN CONFIGS BUTTON CHANGE COLOR
        async function load() {
            $("#openConfigs").css("background", "rgb(0, 130, 255)")
            await buttonTimer(500)

            $("#openConfigs").css("background", "rgb(0, 174, 255)")
        }
        load()

        if (!buttonHandler.configs) {
            $("div#configs").empty()
            $("div#configs").append(`
                <button id="dimensions">Dimensions</button>
                <button class="dimensionInfo infoButton">i</button>
                <div id="dimensionInfoHolder"></div><br>
                <div id="dimensionsHolder"></div>

                <span class="horizontalRows">Horizontal Rows</span> 
                <input id="horizontalRows" type="number">
                <button class="generalInformation infoButton">i</button>
                <div id="generalInformationHolder"></div>
                <br>
                

                <span class="verticalColumns">Vertical Columns</span> <input id="verticalColumns" type="number"><br>

                <span class="numberOfSquares"># of Squares</span>
                <input id="numberOfSquares" type="number"><br>

                <span class="spacingBetweenSquaresX">Spacing Squares X</span> 
                <input id="spacingBetweenSquaresX" type="number"><br>

                <span class="spacingBetweenSquaresY">Spacing Squares Y</span>
                <input id="spacingBetweenSquaresY" type="number"><br>


                <button id="colors">Colors (RGB)</button>
                <button class="colorsInfo infoButton">i</button>
                <div id="colorsInfoHolder"></div>
                <div id="colorsHolder"></div>



                <span class="transformationTime">Transformation Time</span> 
                <input id="transformationTime" type="number"><br>

                <span class="frameRate">Frame Rate</span>
                <input id="frameRate" type="number"><br>

                <span class="showText">Show Text</span>
                <input id="showText" type="text"><br>

                <button id="transformationColor">Transformation Color (RGB)</button>
                <button class="transformationColorInfo infoButton">i</button>
                <div id="transformationColorInfoHolder"></div>
                <div id="transformationColorHolder"></div>
                
                <br>
            `)

            // DIMENSIONS BUTTON 
            $("button#dimensions").click(async function() {
                if (!buttonHandler.dimensions) {
                    $('div#dimensionsHolder').empty()
                    $("div#dimensionsHolder").css("margin", "10px")

                    $('div#dimensionsHolder').append(`
                    <span class="x" name="dimension">X Position</span>
                    <input id="x" type="number" name="dimension">
                    <br>

                    <span class="y" name="dimension">Y Position</span>
                    <input id="y" type="number" name="dimension"><br>

                    <span class="w" name="dimension">Width</span>
                    <input id="w" type="number" name="dimension"><br>

                    <span class="h" name="dimension">Height</span>
                    <input id="h" type="number" name="dimension"><br>
                `)

                    $("input[name='dimension'").each(function () {
                        let id = $(this).attr("id")

                        $(`input#${id}`).css(
                            "margin-left", 100 - parseInt(
                                $(`span.${id}`).css("width")
                            )
                        )

                        // SETTING DEFAULT VALUES
                        $(`input#${id}`).attr(
                            "value", savedValues.dimensions[id]
                        )
                    })

                    buttonHandler.dimensions = true; 
                } else if (buttonHandler.dimensions) {

                    // SAVING VALUES 
                    $("input[name='dimension']").each(function () {
                        let thisID = $(this).attr("id")
                        let userValue = $(`input#${thisID}`).val()
                        savedValues.dimensions[thisID] = parseInt(userValue)
                    })
                    $('div#dimensionsHolder').empty()
                    buttonHandler.dimensions = false; 
                }

                 $("button#dimensions").css("background", "rgb(255, 100, 0)")
                 await buttonTimer(500)
                 $("button#dimensions").css("background", "rgb(255, 153, 0)")
                
            })

            // COLORS BUTTON 
            $("button#colors").click(async function() {
                if (!buttonHandler.colors) {
                    $("div#colorsHolder").empty()

                    $("div#colorsHolder").css("margin","10px")

                    $("div#colorsHolder").append(`
                        <span class="r" name="ForColors">Red</span>
                        <input id="r" name="ForColors" type="text"><br>

                        <span class="g" name="ForColors">Green</span>
                        <input id="g" name="ForColors" type="text"><br>

                        <span class="b" name="ForColors">Blue</span>
                        <input id="b" name="ForColors" type="text"><br>
                    `)

                    $("input[name='ForColors'").each(function () {
                        let id = $(this).attr("id")

                        $(`input#${id}`).css(
                            "margin-left", 100 - parseInt(
                                $(`span.${id}`).css("width")
                            )
                        )

                        // SETTING DEFAULT VALUES 
                        $(this).attr(
                            "value", savedValues.colors[id]
                        )
                    })

                    buttonHandler.colors = true;
                } else if (buttonHandler.colors) {
                    $("input[name='ForColors']").each(function () {
                        let thisID = $(this).attr("id")
                        let userValue = $(`input#${thisID}`).val()
                        if (userValue === "random") {
                            savedValues.colors[thisID] = userValue
                        } else {
                            savedValues.colors[thisID] = parseInt(userValue)
                        }
                    })

                    $("div#colorsHolder").empty()
                    buttonHandler.colors = false;
                }


                 $("button#colors").css("background", "rgb(255, 100, 0)")
                 await buttonTimer(500)
                 $("button#colors").css("background", "rgb(255, 153, 0)")
            })

            // TRANSFORMATION COLOR BUTTON 
            $("button#transformationColor").click(async function () {
                if (!buttonHandler.transColor) {
                    $("div#transformationColorHolder").empty()

                    $("div#transformationColorHolder").css("margin", "10px")

                    $("div#transformationColorHolder").append(`
                        <span class="r" name="ForTransformationColors">Red</span>
                        <input id="r" name="ForTransformationColors" type="text"><br>

                        <span class="g" name="ForTransformationColors">Green</span>
                        <input id="g" name="ForTransformationColors" type="text"><br>

                        <span class="b" name="ForTransformationColors">Blue</span>
                        <input id="b" name="ForTransformationColors" type="text"><br>

                        <span class="special" name="ForTransformationColors">Special</span>
                        <input id="special" name="ForTransformationColors" type="text"><br>
                    `)

                    $("input[name='ForTransformationColors'").each(function () {
                        let id = $(this).attr("id")

                        $(`input#${id}`).css(
                            "margin-left", 100 - parseInt(
                                $(`span.${id}`).css("width")
                            )
                        )

                        // SETTING DEFAULT VALUES 
                        $(this).attr(
                            "value", savedValues.transformationColor[id]
                        )
                    })
                    buttonHandler.transColor = true;
                } else if (buttonHandler.transColor) {
                    // GETTING VALUES 
                    $("input[name='ForTransformationColors']").each(function () {
                        let thisID = $(this).attr("id")
                        let userValue = $(`input#${thisID}`).val()
                        if (thisID === "special" || userValue === "random") {
                            savedValues.transformationColor[thisID] = userValue
                        } else {
                            savedValues.transformationColor[thisID] = parseInt(userValue)
                        }
                    })


                    $("div#transformationColorHolder").empty()
                    buttonHandler.transColor = false;
                }


                $("button#transformationColor").css("background", "rgb(255, 100, 0)")
                await buttonTimer(500)
                $("button#transformationColor").css("background", "rgb(255, 153, 0)")
            })

            // FOR THE SHOWING INPUTS, PUTTING IN DEFAULT VALUES 
            $("input").each(function() {
                let id = $(this).attr("id")

                $(`input#${id}`).css(
                    "margin-left", 175 - parseInt( 
                        $(`span.${id}`).css("width")
                    )
                )

                    $(`input#${id}`).attr("value", savedValues[id])
                
                
            })

            buttonHandler.configs = true; 
        } else if (buttonHandler.configs) {
            // IF CLOSING 

            // SAVING INFO 
            $("input").each(function () {
                let thisID = $(this).attr("id")
                let thisName = $(this).attr("name")

                if (thisName === undefined) {
                    var userValue = $(`input#${thisID}`).val()
                } else {
                    if (thisName === "ForTransformationColors") {
                        var userValue = $(`input[id='${thisID}'][name='${thisName}']`).val()
                        thisID += " TFC"
                    }
                    else var userValue = $(`input[id='${thisID}'][name='${thisName}']`).val()
                }

                // console.log(thisID, userValue)
                if (thisID === "x" || thisID === "y" || thisID === "w" || thisID === "h") {
                    savedValues.dimensions[thisID] = parseInt(userValue)
                } else if (thisID === "r" || thisID === "g" || thisID === "b") {
                    if (userValue === "random") {
                        savedValues.colors[thisID] = userValue
                    } else {
                        savedValues.colors[thisID] = parseInt(userValue)
                    }
                } else if (thisID === "showText") {
                    userValue = userValue === "true" ? true : false; 
                    savedValues[thisID] = userValue
                } else if (thisID.includes("TFC")) {
                    thisID = thisID.split(" TFC").join("")

                    if (userValue === "random" || thisID === "special") {
                        savedValues.transformationColor[thisID] = userValue
                    } else {
                        savedValues.transformationColor[thisID] = parseInt(userValue)
                    }
                } else {
                    savedValues[thisID] = parseInt(userValue)
                }
            })

            // console.log(savedValues)


            $('div#configs').empty()

            for (let x of Object.keys(buttonHandler)) {
                buttonHandler[x] = false; 
            }
        }

        // INFO BUTTONS 
        $("button.infoButton").click(function() {
            const nameOfBtnClass = $(this).attr("class").split(" ")[0];

            if (nameOfBtnClass === "dimensionInfo") {
                async function load() {
                    $(`button.dimensionInfo`).css("background", "rgb(0, 130, 255)")
                    await buttonTimer(500)
                    $(`button.dimensionInfo`).css("background", "rgb(0, 174, 255)")
                }
                load()
                
                if (!buttonHandler.dimensionsInfo) {
                    // CHANGE BUTTON COL 


                    $("div#dimensionInfoHolder").append(`
                    <div class="popup">X Position is the starting point where the starting square will be placed and all other squares will be placed after.<br>Y position is same as X except on the Y-axis. <em>Note: XY axis relative to what a computer sees. </em><br>Width is the width of the squares and height is the height of the squares. All real, positive numerical values.</div>
                    `)
                    buttonHandler.dimensionsInfo = true;
                } else if (buttonHandler.dimensionsInfo) {
                    $("div#dimensionInfoHolder").empty()
                    buttonHandler.dimensionsInfo = false;
                }
            } else if (nameOfBtnClass === "generalInformation") {
                async function load() {
                    $(`button.generalInformation`).css("background", "rgb(0, 130, 255)")
                    await buttonTimer(500)
                    $(`button.generalInformation`).css("background", "rgb(0, 174, 255)")
                }
                load()
                if (!buttonHandler.generalInfo) {
                    $("div#generalInformationHolder").append(`
                    <div class="popup">Horizontal rows is how many squares will be in a single horizontal row. Vertical columns is how many squares will be in a single vertical column.<br># of squares is how many Horizontal-by-Vertical groups of squares there will be. Spacing Squares X/Y is the spacing each square will have in a group of squares. <br><em>Note: XY axis relative to what a computer sees.</em><br>Transformation time is how many milliseconds an individual square will take to transform into the infecting color.<br>Frame rate is the frames per second (1 to 60).<br>'Show Text', if set to 'true' will show for 1 frame (super quickly, set FPS to 1 to see it) will show each square within a single group of square being tagged with a number which shows the order of their infection; this can only be set to <strong>true</strong> or <strong>false</strong>.</div>
                    `)
                    
                    buttonHandler.generalInfo = true; 
                } else if (buttonHandler.generalInfo) {
                    $("div#generalInformationHolder").empty()
                    buttonHandler.generalInfo = false; 
                }
            } else if (nameOfBtnClass === "colorsInfo") {
                async function load() {
                    $(`button.colorsInfo`).css("background", "rgb(0, 130, 255)")
                    await buttonTimer(500)
                    $(`button.colorsInfo`).css("background", "rgb(0, 174, 255)")
                }
                load()
                if (!buttonHandler.colorsInfo) {
                    $("div#colorsInfoHolder").append(`
                        <div class="popup">The initial colors of the squares. Can be either 0-255 numerical value <em>or</em> <strong>random</strong>, which sets a random R/G/B value for all the squares.</div>
                    `)
                    buttonHandler.colorsInfo = true; 
                } else if (buttonHandler.colorsInfo) {
                    $("div#colorsInfoHolder").empty()
                    buttonHandler.colorsInfo = false;
                }
            } else if (nameOfBtnClass === "transformationColorInfo") {
                async function load() {
                    $(`button.transformationColorInfo`).css("background", "rgb(0, 130, 255)")
                    await buttonTimer(500)
                    $(`button.transformationColorInfo`).css("background", "rgb(0, 174, 255)")
                }
                load()
                if (!buttonHandler.transColorInfo) {
                    $("div#transformationColorInfoHolder").append(`
                        <div class="popup expand">The colors the squares will be once infected. R/G/B can be either be a 0-255 numerical value <em>or</em>  <strong>random</strong>, which sets a random R/G/B value for all the squares.<br>The Special setting has miscellaneous effects on all the squares.<br><strong>ONLY-R/G/B (e.g., ONLY-R)</strong>:Makes it so that all RGB values will the be same based off the chosen letter. ONLY-R indicates that the transformation color will be (if R = 200) rgb(200, 200, 200). Same goes for ONLY-G, ONLY-B.<br><strong>RANDOM-R/G/B</strong>: Makes each square have a constantly changing/random R/G/B value. Can be set as RANDOM-R/G/B or chained together as 'RANDOM-RG', 'RANDOM-GB', etc.<br><em>Commands can be chained together, such as putting Special as 'ONLY-R RANDOM-R', 'ONLY-G RANDOM-G'. You must separate multiple commands by a space and all characters are case sensitive. Note that nonsense chained commands such as 'ONLY-R RANDOM-G' will most likely not work as intended.</em><br><strong>RAINBOW</strong>: Changes the rgb values of each of the squares to have a rainbow pattern. Overrides any RANDOM- or ONLY- command.<br><strong>ANY-1</strong>: Randomly chooses from the list of commands once and sticks with it for the rest of the transformations. 'ANY-2' is not in the list of potential commands. <br><strong>ANY-2</strong>: Randomly chooses from the list of commands constantly. 'ANY-1' is not in the list of potential commands.  </div>
                    `)
                    buttonHandler.transColorInfo = true;
                } else if (buttonHandler.transColorInfo) {
                    $("div#transformationColorInfoHolder").empty()
                    buttonHandler.transColorInfo = false;
                }
            }
        })
    })

    // APPLYING VALUES 
    $("button#start").click(function () {

        // set just in case user does not define these values 
       squareConfigs.dimensions.x = 10; 
       squareConfigs.dimensions.y = 10; 
        
        $("input").each(function() {
            let id = $(this).attr("id")
            let name = $(this).attr("name")

            for (let configs of Object.keys(squareConfigs)) {
                if (typeof squareConfigs[configs] !== "object") {
                    let userValue = $(`input#${id}`).val()
                    if (id !== "showText" && squareConfigs[id] !== undefined) {
                        userValue = parseInt(userValue)
                        squareConfigs[id] = userValue
                    } else if (id === "showText" && squareConfigs[id] !== undefined) {
                        userValue === "true" ? squareConfigs[id] = true : squareConfigs[id] = false;
                    } 
                } else if (squareConfigs[configs][id] !== undefined && typeof squareConfigs[configs] === "object") {
                    
                    if (name === "dimension") {
                        $(`input[name='${name}`).each(function () {
                            let thisID = $(this).attr("id")
                            let userValue = $("input#" + thisID).val()
                            squareConfigs[configs][thisID] = parseInt(userValue)
                        })
                        
                    } else if (name === "ForColors") {
                        $(`input[name='${name}`).each(function() {
                            let thisID = $(this).attr("id")
                            let userValue = $("input#"+thisID).val()
                            if (userValue === "random") {
                                squareConfigs[configs][thisID] = "random"
                            } else {
                                squareConfigs[configs][thisID] = parseInt(userValue)
                            }
                        })
                    } else if (name === "ForTransformationColors" && configs === "transformationColor") {
                        $(`input[name='${name}`).each(function () {
                            let thisID = $(this).attr("id")
                            let userValue = $(`input[id='${thisID}'][name='${name}']`).val()
                            // THIS IS HOW YOU DO MULTIPLE SELECTORS !!!!!! input[id="."][value="."][name=""]

                            if (userValue === "random") {
                                // console.log("RANDOM",thisID, userValue, configs)
                                squareConfigs[configs][thisID] = "random"
                            } else if (thisID === "special") {
                                // console.log("SPECIAL", thisID, userValue, configs)
                                squareConfigs[configs][thisID] = userValue
                            } else {
                                // console.log("NUMBER",thisID, configs, userValue)
                                squareConfigs[configs][thisID] = parseInt(userValue)
                            }
                        })
                    }
                    
                }
            }
        })

        // console.log(squareConfigs)

        wholeSquareHolder = [];
        setConstants()
        test()


    })
    
    function test() {
        frameRate(squareConfigs.frameRate);
    for (let n = 0; n < squareConfigs.numberOfSquares; n++) {
        for (let i = 1; i <= (squareConfigs.horizontalRows * squareConfigs.verticalColumns) ; i++) {
            

            // if it hits edge of screen 
            if (squareConfigs.dimensions.x >= width || i === 1 && squareConfigs.dimensions.x + (squareConfigs.dimensions.w * squareConfigs.horizontalRows) > width) {
                // change >= to > for 1 edge case lOL 
                squareConfigs.dimensions.x = squareConfigs.constantValues.actuallyConstantX;


                // if spacingY 0, -10. if spacingY 10, -0. This seems to work, marked because may or may not cause bugs because  programming is fun 
                // let gapBetweenLayers = squareConfigs.dimensions.h - squareConfigs.spacingBetweenSquaresY
                // ^^ not sure this is needed anymore 


                // squareConfigs.dimensions.y += squareConfigs.dimensions.h + (squareConfigs.dimensions.w * squareConfigs.horizontalRows) - gapBetweenLayers; // HERE  
                // squareConfigs.dimensions.y += 60
                squareConfigs.dimensions.y += squareConfigs.spacingBetweenSquaresY + (squareConfigs.dimensions.h * squareConfigs.verticalColumns) // This also seems to be working 

                squareConfigs.constantValues.x = squareConfigs.dimensions.x;
                squareConfigs.constantValues.y = squareConfigs.dimensions.y; 
            }

            // to make sure that theyre random and dont transform the original into one random color, making it that single color forever 
            let templateColors = {r: squareConfigs.colors.r, g: squareConfigs.colors.g, b: squareConfigs.colors.b}
            for (let col of Object.keys(squareConfigs.colors)) {
                if (squareConfigs.colors[col] === "random") templateColors[col] = random(0, 255)
            }

            smallSquares.push([squareConfigs.dimensions.x, squareConfigs.dimensions.y, squareConfigs.dimensions.w, squareConfigs.dimensions.h, templateColors.r, templateColors.g, templateColors.b]) // last three, r = #, g = #, b = #. this can be implemented better idc rn tho im just playing around


            if (i % squareConfigs.horizontalRows === 0  ) {
                squareConfigs.dimensions.y += squareConfigs.dimensions.h  
                squareConfigs.dimensions.x = (squareConfigs.constantValues.x) - squareConfigs.dimensions.w ;
                

           
            }

            // squareConfigs.dimensions.x += 10 changes += 10 to += square width 
            squareConfigs.dimensions.x += squareConfigs.dimensions.w
            // console.log(i, squareConfigs.dimensions.x, squareConfigs.dimensions.y)

            
            

        }


        // squareConfigs.dimensions.x += squareConfigs.spacingBetweenSquaresX + 2 * (squareConfigs.verticalColumns * squareConfigs.horizontalRows)
        squareConfigs.dimensions.x += squareConfigs.spacingBetweenSquaresX + (squareConfigs.dimensions.w * squareConfigs.horizontalRows) // This seems to be working Less Goooo 


        squareConfigs.constantValues.x = squareConfigs.dimensions.x

        squareConfigs.dimensions.y = squareConfigs.constantValues.y;

        
        wholeSquareHolder.push(new WholeSquare(smallSquares))
        smallSquares = [];

    }
} test()

}

let circColor = [];

function draw () {
    background(255, 119, 0);

    for (let i = 0; i < (squareConfigs.horizontalRows * squareConfigs.verticalColumns); i++) { // change i < 25 to i < (squareConfigs.horizontalRows * squareConfigs.verticalColumns). i have no idea why it was i < 25 lol
        for (let x of wholeSquareHolder) {
            fill(x.sqr[i][4] , x.sqr[i][5]  , x.sqr[i][6] )  // 4 = r, 5 = g, 6 = b 
            // fill(x.sqr[i][4])
            rect(x.sqr[i][0], x.sqr[i][1], x.sqr[i][2], x.sqr[i][3]) //x,y,w,h

            // just for the circle that follows mouse 
            if (
                x.sqr[i][0]  <= mouseX && mouseX <= x.sqr[i][0] + squareConfigs.dimensions.w
                && x.sqr[i][1] <= mouseY && mouseY <= x.sqr[i][1] + squareConfigs.dimensions.h
            ) {
                circColor = [x.sqr[i][4], x.sqr[i][5], x.sqr[i][6] ];
            }
        }
    }


    fill(circColor[0], circColor[1], circColor[2]);
    $("h1#rgbValue").html(`R: ${circColor[0]} G: ${circColor[1]} B: ${circColor[2]}`)
    ellipse(mouseX, mouseY, 10)
    
    

}

let strokeTog = false; 
function keyPressed () {
    // console.log(keyCode)
    // 13 is enter 
    if (keyCode === 13 && !strokeTog) {
        noStroke ();
        strokeTog = true; 
    } else {
        stroke (0);
        strokeTog = false;  
    }

}
// THIS WAS mouseClicked CHANGE IT BACK WHEN CODE GOOD LOL
function mouseClicked() {
    for (let i = 0; i < (squareConfigs.horizontalRows * squareConfigs.verticalColumns); i++) { 
        for (let x of wholeSquareHolder) {

            if (
                x.sqr[i][0] <= mouseX && mouseX <= x.sqr[i][0] + squareConfigs.dimensions.w
                && x.sqr[i][1] <= mouseY && mouseY <= x.sqr[i][1] + squareConfigs.dimensions.h
            ) {
               
                // setting up the colors for the squares 
                let templateTransformColors = { r: squareConfigs.transformationColor. r, g: squareConfigs.transformationColor.g, b: squareConfigs.transformationColor.b}
                
                for (let col of Object.keys(squareConfigs.transformationColor)) {
                    if (squareConfigs.transformationColor[col] === "random") templateTransformColors[col] = random(0, 255)
                }

                
                if (squareConfigs.transformationColor.special.includes("ONLY-")) {
                    let importantColor = squareConfigs.transformationColor.special

                    if (importantColor.includes(" ")) {
                        importantColor = importantColor.split(" ")
                        for (let a = 0; a < importantColor.length; a++) {
                            if (importantColor[a].includes("ONLY-")) {
                                importantColor = importantColor[a].split("ONLY-").join("").toLowerCase()
                            }
                        } 
                    } else if (!importantColor.includes(" ")) {
                        importantColor = importantColor.split("ONLY-").join("").toLowerCase()
                    }

                    let colorLetters = ["r","g","b"]
                    for (let z = 0; z < colorLetters.length; z++) {
                        if (!importantColor.includes(colorLetters[z])) {
                            templateTransformColors[ colorLetters[z] ] = templateTransformColors[importantColor]
                            
                            // TESTING THIS
                            squareConfigs.transformationColor[ colorLetters[z] ] = templateTransformColors[importantColor]

                           
                        }
                    }
                }
                

                const affectingColor = [templateTransformColors.r, templateTransformColors.g, templateTransformColors.b]
                
                // console.log(affectingColor)


                // square[0-6] affects all square within a square 
                // delay in a for loop stack overflow with the save                     

                // let whichSquare = makeShuffledArrayOfNumbers(x.sqr.length)

                let potentialNumbers = [];
                let startingSquarePositionFrom0To = (i % squareConfigs.horizontalRows)

            
                for (let j = 0; j <= (squareConfigs.horizontalRows + squareConfigs.verticalColumns)  ; j++) { // FOR let j ... IDK IF ADDED VERT COLUMNS WILL FIX ISSUE WITH IT NOT REACHING EVERY SQUARE ... I REMOVED IT REAL QUICK BUT IK IT'S STILL BROKEN 
                    for (let v = 0; v <= squareConfigs.verticalColumns + squareConfigs.horizontalRows  ; v++) { // SAME HERE CODE JUST SEEMS TO BE MAGICALLY WORKING WHEN I ADDED THIS SO IM KEEPING IT UNTIL I SEE A BUG 

                        // console.log(newX, startingX, newX >= startingX)
                        try {
                            // down columns from initial hit box 
                            fill(0)
                            
                            if ( startingSquarePositionFrom0To + v < squareConfigs.horizontalRows  ) {

                                
                                if (startingSquarePositionFrom0To + v < squareConfigs.horizontalRows) {

                                if (squareConfigs.showText) {

                                
                                    text(
                                        j + v + 1, 
                                        x.sqr[i + (j * squareConfigs.horizontalRows) + v][0], 
                                        x.sqr[i + (j * squareConfigs.horizontalRows) + v][1], 
                                        11, 11
                                    )
                                        
                                }
                                x.sqr[i + (j * squareConfigs.horizontalRows) + v].push(j + v + 1)
                                potentialNumbers.push(j + v + 1)
                                }


                                // HERE
                                if (
                                    startingSquarePositionFrom0To - v >= 0
                                ) {
                                    for (let b = 1; b < squareConfigs.horizontalRows - (squareConfigs.horizontalRows - startingSquarePositionFrom0To) + 1  ; b++) {
           
                                        if (squareConfigs.showText) {
                                        
                                                text(
                                                    j + b + 1,
                                                    x.sqr[i + (j * squareConfigs.horizontalRows)  - b][0],
                                                    x.sqr[i + (j * squareConfigs.horizontalRows)  - b][1],
                                                    10.01, 10.01
                                                )
                                                
                                        }

                                      
                                        x.sqr[i + (j * squareConfigs.horizontalRows) - b].push(j + b + 1)
                                        potentialNumbers.push(j + b + 1)
                                      
                                    }
                                }
                               
                            }
                        } catch { }



                        try {
                            // up columns from initial hit box 

                            if (j !== 0 && startingSquarePositionFrom0To + v < squareConfigs.horizontalRows) {
                                fill(0)
                                // added if statement 
                                if (startingSquarePositionFrom0To + v < squareConfigs.horizontalRows) {

                                    if (squareConfigs.showText) {
                                        
                                            text(
                                                j + v + 1, 
                                                x.sqr[i - (j * squareConfigs.horizontalRows) + v][0], 
                                                x.sqr[i - (j * squareConfigs.horizontalRows) + v][1],
                                                11, 11
                                            )
                                           
                                    }
                                    
                                   
                                    x.sqr[i - (j * squareConfigs.horizontalRows) + v].push(j + v + 1)
                                    potentialNumbers.push(j + v + 1)
                                  
                                }
                               
                                if (
                                    startingSquarePositionFrom0To - v >= 0
                                    
                                ) {
                                    for (let b = 1; b < squareConfigs.horizontalRows - (squareConfigs.horizontalRows - startingSquarePositionFrom0To) + 1; b++) {

                                        if (squareConfigs.showText) {
                                            
                                                text(
                                                    j + b + 1,
                                                    x.sqr[i - (j * squareConfigs.horizontalRows) - b][0],
                                                    x.sqr[i - (j * squareConfigs.horizontalRows) - b][1],
                                                    10.01, 10.01
                                                )
                                               
                                        }
                                    
                                        x.sqr[i - (j * squareConfigs.horizontalRows) - b].push(j + b + 1)
                                        potentialNumbers.push(j + b + 1)
                                        
                                

                                    }
                                } 

                            }
                        } catch { }
                    }
                }


                // bunch of numbers would get added on so i remove them 
                for (let a = 0; a < x.sqr.length; a++) {
                    x.sqr[a][7] = x.sqr[a][x.sqr[a].length - 1]
                    x.sqr[a] = x.sqr[a].slice(0, 8)
                }
                


                // console.log(x.sqr, potentialNumbers, Math.max(...potentialNumbers))

                const timer = ms => new Promise(res => setTimeout(res, ms))
                async function load() {
                    let notHitSquares = [false, false, false] // R = 0, G = 1, B = 2
                    let combinations = ["RANDOM_ALL", "ONLY-R", "ONLY-G", "ONLY-B", "RANDOM-R ONLY-R", 'RANDOM-G ONLY-G', 'RANDOM-B ONLY-B', 'RANDOM-RG', 'RANDOM-RB', 'RANDOM-GB', 'RANDOM-GR', 'RANDOM-R', 'RANDOM-G', 'RANDOM-B', 'RAINBOW']

                    if (squareConfigs.transformationColor.special.includes("ANY-2") || squareConfigs.transformationColor["key"] === true) {
                        squareConfigs.transformationColor.special =
                            combinations[Math.floor(Math.random() * combinations.length)]
                        squareConfigs.transformationColor["key"] = true; // used as an identifier to make sure its always changing  
                    }
                    else if (squareConfigs.transformationColor.special.includes("ANY-1")) {
                        
                        squareConfigs.transformationColor.special = 
                            combinations[ Math.floor(Math.random() * combinations.length) ]
                        // console.log(squareConfigs.transformationColor.special) 
                    }
                    for (let k = 1; k <= Math.max(...potentialNumbers); k++) {
                        for (let u = 0; u < x.sqr.length; u++) {
                            // console.log(`X: ${x.sqr[u][7]} K: ${k}`)
                            if (x.sqr[u][x.sqr[u].length - 1] === k) {

                                if (squareConfigs.transformationColor.special.includes("RANDOM-")) {
                                    let whichValueConstantlyChanging = squareConfigs.transformationColor.special

                                    if (whichValueConstantlyChanging.includes(" ")) {
                                        whichValueConstantlyChanging = whichValueConstantlyChanging.split(" ")
                                        for (let b = 0; b < whichValueConstantlyChanging.length; b++) {
                                            if (whichValueConstantlyChanging[b].includes('RANDOM-')) {
                                                whichValueConstantlyChanging = whichValueConstantlyChanging[b].split("RANDOM-").join("")
                                            }
                                        }
                                    } else if (!whichValueConstantlyChanging.includes(" ")) {
                                        whichValueConstantlyChanging = whichValueConstantlyChanging.split("RANDOM-").join("")
                                    }

                                   
                                    if (whichValueConstantlyChanging.includes("R")) {
                                        x.sqr[u][4] = random(0, 255)
                                        notHitSquares[0] = true; 
                                    }
                                    if (whichValueConstantlyChanging.includes("G")) {
                                        x.sqr[u][5] = random(0, 255)
                                        notHitSquares[1] = true;
                                    }
                                    if (whichValueConstantlyChanging.includes("B")) {
                                        x.sqr[u][6] = random(0, 255)
                                        notHitSquares[2] = true; 
                                    }

                                    // i dint wanna hard code each condition but it's licherally just 3 if statements iM FINE. 

                                    if (squareConfigs.transformationColor.special.includes("ONLY-R")) {
                                        x.sqr[u][5] = x.sqr[u][4]
                                        x.sqr[u][6] = x.sqr[u][4]
                                        notHitSquares[0] = true;
                                        notHitSquares[1] = true; 
                                        notHitSquares[2] = true;
                                    } else if (squareConfigs.transformationColor.special.includes('ONLY-G')) {
                                        x.sqr[u][4] = x.sqr[u][5]
                                        x.sqr[u][6] = x.sqr[u][5]
                                        notHitSquares[0] = true;
                                        notHitSquares[1] = true;
                                        notHitSquares[2] = true;
                                    } else if (squareConfigs.transformationColor.special.includes("ONLY-B")) {
                                        x.sqr[u][4] = x.sqr[u][6]
                                        x.sqr[u][5] = x.sqr[u][6]
                                        notHitSquares[0] = true;
                                        notHitSquares[1] = true;
                                        notHitSquares[2] = true;
                                    }

                                    if (notHitSquares.includes(false)) {
                                        for (let C = 0; C < notHitSquares.length; C++) {
                                            if (!notHitSquares[C]) {
                                                x.sqr[u][4 + C] = affectingColor[C]
                                            }
                                        }
                                    }
                                }
                                
                                else if (squareConfigs.transformationColor.special.includes("RANDOM_ALL")) {
                                    x.sqr[u][4] = random(0, 255)
                                    x.sqr[u][5] = random(0, 255)
                                    x.sqr[u][6] = random(0, 255)
                                } else if (squareConfigs.transformationColor.special.includes("RAINBOW")) {
                                    // COPY PASTED FROM ./rainbow gradient.html
                                    for (let i in color) {
                                        if (color[i] < 0) {
                                            color[i] = 0;
                                        }
                                        else if (color[i] > 255) {
                                            color[i] = 255;
                                        }
                                    }

                                    if (color.r === 255 && color.g === 0 && color.b !== 0) {
                                        color.b += -rateOfIncrOrDecr;
                                    }

                                    else if (color.r === 255 && color.g < 255) {
                                        color.g += rateOfIncrOrDecr;
                                    }

                                    if (color.r <= 255 && color.g === 255) {
                                        color.r += -rateOfIncrOrDecr;
                                    }

                                    if (color.r <= 0 && color.b < 255) {
                                        color.r = 0;
                                        color.b += rateOfIncrOrDecr;
                                    }

                                    if (color.r === 0 && color.g <= 255 && color.b === 255) {
                                        color.g += -rateOfIncrOrDecr;
                                    }
                                    if (color.r < 255 && color.g === 0 && color.b === 255) {
                                        color.g = 0;
                                        color.r += rateOfIncrOrDecr;

                                    }

                                    x.sqr[u][4] = color.r 
                                    x.sqr[u][5] = color.g 
                                    x.sqr[u][6] = color.b 
                                } else {
                                    x.sqr[u][4] = affectingColor[0]
                                    x.sqr[u][5] = affectingColor[1]
                                    x.sqr[u][6] = affectingColor[2]
                                }
                                // await timer(squareConfigs.transformationTime)  HERE FOR INDIVUDAL SQUARES 

                            }

                            
                        }
                        await timer(squareConfigs.transformationTime ) // HERE FOR ENTIRE NUMBERS AT ONCE 
                    }
                }
                load()
 
            }
        }
    }
}

