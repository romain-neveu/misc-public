(() => {

    const loadData = (data) => {
        loadGraph(data);
        loadNotes(data)
    }

    const loadGraph = (data) => {
        let measures = [["Date", "Glycemie", "Dosage unité ui"]];
        let current_ui = 6;
        data.stats.forEach(stat => {
            if (stat.mesure) {
                measures.push([stat.date, stat.mesure, current_ui]);
            }
            // Quand on change le dosage
            if (stat.change_ui) {
                current_ui = stat.change_ui;
            }
        });

        // Load the Visualization API and the corechart package.
        google.charts.load('current', { 'packages': ['line'] });

        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.setOnLoadCallback(() => {
            var data = google.visualization.arrayToDataTable(measures);

            var options = {
                title: 'La glycémie de Georges',
                legend: { position: 'bottom' },
                height: 400,
                series: {
                    0: { targetAxisIndex: 0 },
                    1: { targetAxisIndex: 1 }
                }
            };

            var chart = new google.charts.Line(document.getElementById('graph'));

            chart.draw(data, google.charts.Line.convertOptions(options));
        });
    }

    const loadNotes = (data) => {

        var ul = document.createElement("ul");
        data.stats.forEach(stat => {
            var li = document.createElement("li");
            var date = new Date(stat.date);

            li.textContent = date.getUTCFullYear() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + ": ";
            if (stat.note) {
                li.textContent += stat.note;
            } else if (stat.change_ui) {
                li.textContent += "passage à " + stat.change_ui + "ui matin et soir";
            } else { 
                li.textContent += "glycémie " + stat.mesure;
            }

            ul.append(li);
        });

        document.getElementById('notes').append(ul);
    }

    // Try first the file on github to have the last version
    YAML.load('https://raw.githubusercontent.com/romain-neveu/misc-public/main/glycemie-georges/public/data.yml',
        data => {
            if (data) {
                loadData(data)
            }
            else {
                // At least get the current file
                YAML.load('./data.yml', data => loadData(data));
            }
        });
})();

