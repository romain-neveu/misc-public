(() => {
    YAML.load('./data.yml', data => {

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

            var chart = new google.charts.Line(document.getElementById('stats'));

            chart.draw(data, google.charts.Line.convertOptions(options));
        });
    });
})();

