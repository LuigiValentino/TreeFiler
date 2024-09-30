    document.getElementById('zipFileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            JSZip.loadAsync(arrayBuffer).then(function(zip) {
            const treeData = buildFileTree(zip.files);
            const treeContainer = document.getElementById('treeContainer');
            treeContainer.innerHTML = '';
            treeContainer.appendChild(renderTree(treeData));

            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileSize').textContent = `${(file.size / 1024).toFixed(2)} KB`;
            document.getElementById('fileDate').textContent = new Date(file.lastModified).toLocaleDateString();
            
            document.querySelector('.custom-file-label').textContent = file.name;
            });
        };
        reader.readAsArrayBuffer(file);
        }
    });

    function buildFileTree(files) {
        const root = {};

        Object.keys(files).forEach(function(fileName) {
        const parts = fileName.split('/');
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) {
            current[part] = (i === parts.length - 1) ? null : {};
            }
            current = current[part];
        }
        });

        return root;
    }

    function renderTree(node) {
        const ul = document.createElement('ul');

        Object.keys(node).forEach(function(key) {
        const li = document.createElement('li');
        li.textContent = key;

        if (node[key] !== null) {
            li.classList.add('folder', 'collapsed');
            
            const arrowIcon = document.createElement('i');
            arrowIcon.classList.add('fas', 'fa-angle-right');
            
            const folderIcon = document.createElement('i');
            folderIcon.classList.add('fas', 'fa-folder');
            
            li.prepend(arrowIcon);
            li.prepend(folderIcon);

            li.appendChild(renderTree(node[key]));
            li.querySelector('ul').classList.add('hidden'); 


            li.addEventListener('click', function(event) {
            event.stopPropagation();
            const children = li.querySelector('ul');
            if (children) {
                children.classList.toggle('hidden');
                arrowIcon.classList.toggle('fa-angle-right');
                arrowIcon.classList.toggle('fa-angle-down');
                li.classList.toggle('expandable');
            }
            });
        } else {
            li.classList.add('file');
            const fileIcon = document.createElement('i');
            fileIcon.classList.add('fas', 'fa-file');
            li.prepend(fileIcon);
        }

        ul.appendChild(li);
        });

        return ul;
    }