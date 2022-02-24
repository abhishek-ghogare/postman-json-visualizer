let template = `
<html>
<head>
    <!-- Syntax highlighter START -->
    <!-- To change the code color theme, go to https://highlightjs.org/static/demo/ -->
    <!-- Then choose the color theme, and replace "style/<themeName>.min.css" in below URL -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/hybrid.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/highlight.min.js"></script>
    <!-- and it's easy to individually load additional languages -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/languages/go.min.js"></script> -->
    <!-- Syntax highlighter END -->

    <script src="https://cdn.jsdelivr.net/npm/jsonpath@1.0.2/jsonpath.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>

    <!-- Set code font to awesome 'JetBrains Mono' -->
    <style>
        pre > code {
            font-family: 'JetBrains Mono','Sans Mono','Consolas','Courier',monospace;
            -webkit-font-smoothing: antialiased; /* Font looks a little thinner and beautiful thanks to this */
            font-size:small;
        }
    </style>
</head>
<body>
    <div>
      <div>
        <input id="filter" style="width:450px;" type="text" placeholder="Example query: $..name.first" value="$">
        <button id="resetButton" style="background-color:red;color:white;">Reset</button>
        <input id="showErrors" type="checkbox" value="0" checked/>
        <span class="item-text" style="font-family:'JetBrains Mono','Sans Mono','Consolas','Courier',monospace;">Show Evaluation Errors</span>
      </div>
      <div id="errors" style="font-family:'JetBrains Mono','Sans Mono','Consolas','Courier',monospace;color:red;display:none;"></div>
      <div>
        <p id="content" style="font-family:'JetBrains Mono','Sans Mono','Consolas','Courier',monospace;color:green;font-size:18px;"></p>
      </div>
    </div>
</body>
</html>

<script>
    pm.getData( (error, value) => {
        const extractedData = jsonpath.query(value, '$');
        
        function unEscapeSpecialCharacters(str)  {
            return str.replace(/\\\\n/g, "\\n").replace(/\\\\r/g, "\\r").replace(/\\\\t/g, "\\t");
        }

        function updateJsonBoard() {
                try {
                    let filteredData = jsonpath.query(extractedData, $("#filter").val());
                    $("#content, #errors").empty();
                    $("#content").append("<pre><code class='language-json'>" + unEscapeSpecialCharacters(JSON.stringify(filteredData, null, 2)) + "</code></pre>");
                    hljs.highlightAll();
                } catch (err) {
                    console.info(err);
                    $("#errors").empty();
                    $("#errors").append("<pre><code>" + err + "</code></pre>");
                }
            }

        // Initialize states
        updateJsonBoard();
        $("#errors").toggle(this.checked);

        $(function() {
            $('#filter').keyup(updateJsonBoard);
        });
        
        $( "#resetButton").click(function() {
            $("#content, #errors").empty();
            $("#filter").val('$');
            updateJsonBoard();
        })
    })

    $(function() {
        $("#showErrors").on("click",function() {
            $("#errors").toggle(this.checked);
        });
    });
</script>`

pm.visualizer.set(template, pm.response.json())
