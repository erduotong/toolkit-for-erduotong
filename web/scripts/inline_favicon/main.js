//here
const inline_icon = () => {
    // noinspection JSUnusedGlobalSymbols
    return {
        name: "inline-svg",
        apply: "build",
        enforce: "post",

        closeBundle() {
            //注意Linux上会失效 需要单独一个网页头图片
            console.log("内联svg");
            const indexPath = resolve(__dirname, "dist", "index.html");
            const html = readFileSync(indexPath, "utf-8");
            const dom = new JSDOM(html);
            const document = dom.window.document;
            // Remove all meta tags with name="description"
            const metaTags = document.querySelectorAll("meta[name=\"description\"]");
            metaTags.forEach(tag => {
                tag.parentNode.removeChild(tag);
            });
            const links = document.querySelectorAll("link[href$='.svg']");
            links.forEach((link) => {
                let href = link.getAttribute("href");
                if (href.startsWith("/")) {
                    href = href.substring(1);
                } else if (href.startsWith("./")) {
                    href = href.substring(2);
                }
                const svgPath = resolve(__dirname, "dist", href);
                const svgContent = readFileSync(svgPath, "utf-8");
                const dataUrl = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;

                // Set the data URL as the href attribute of the link element
                link.setAttribute("href", dataUrl);

                // Delete the SVG file
                fs.unlinkSync(svgPath);
            });

            const updatedHtml = dom.serialize();
            writeFileSync(indexPath, updatedHtml);
            console.log("内联svg完成");
        },
    };
};