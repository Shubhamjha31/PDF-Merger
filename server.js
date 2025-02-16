import express from "express";
import PDFMerger from 'pdf-merger-js';
import multer from "multer";
import fs from 'fs';

const upload = multer({ dest: 'uploads/' })

var merger = new PDFMerger();

const app = express();
const port = 3000;

app.use(express.static("public"));
const merge = async (file1, file2)=>{
    await merger.add(file1);
    await merger.add(file2);
    await merger.save('merged.pdf');
    // Delete the uploaded files after merging.
    fs.unlinkSync(file1);
    fs.unlinkSync(file2);
};

app.get("/", (req, res) =>{
    res.render("index.ejs");
    fs.unlink("merged.pdf", (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error("Error deleting merged.pdf:", err);
        } else {
            console.log("merged.pdf deleted (if existed).");
        }
    });
    
});

app.get("/about", (req, res) =>{
    res.render("about.ejs");
});

app.post("/merge", upload.array('pdfs', 2), async function (req, res, next) {
    await merge(req.files[0].path, req.files[1].path);
    res.download('merged.pdf');
  });

app.listen(port, ()=>{
    console.log("Server is running on port "+port);
});
