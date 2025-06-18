document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('textArea');
    const documentNameInput = document.getElementById('documentName');
    const clearButton = document.getElementById('clearButton');
    const newDocumentButton = document.getElementById('newDocumentButton');
    const exportButton = document.getElementById('exportButton');
    const documentsList = document.getElementById('documentsList');
    const message = document.getElementById('message');

    // 初始化文档数组
    let documents = JSON.parse(localStorage.getItem('documents')) || [];
    let currentDocumentIndex = documents.length > 0 ? documents.length - 1 : 0;

    // 加载文档
    function loadDocument(index) {
        const document = documents[index];
        textArea.value = document.content || '';
        documentNameInput.value = document.name || '';
        currentDocumentIndex = index;
        renderDocumentsList();
    }

    // 渲染文档列表
    function renderDocumentsList() {
        documentsList.innerHTML = '';
        documents.forEach((doc, index) => {
            const li = document.createElement('li');
            li.textContent = doc.name || `文档${index + 1}`;
            li.addEventListener('click', () => {
                loadDocument(index);
            });
            documentsList.appendChild(li);
        });
    }

    // 初始化文档列表
    renderDocumentsList();

    // 保存文档内容和名称
    function saveDocument() {
        documents[currentDocumentIndex] = {
            name: documentNameInput.value,
            content: textArea.value,
            timestamp: Date.now()
        };
        localStorage.setItem('documents', JSON.stringify(documents));
        message.textContent = '内容已保存';
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }

    // 监听文本区域和文档名称输入框的变化
    textArea.addEventListener('input', saveDocument);
    documentNameInput.addEventListener('input', saveDocument);

    // 清除内容
    clearButton.addEventListener('click', () => {
        documents[currentDocumentIndex].content = '';
        textArea.value = '';
        saveDocument();
        message.textContent = '内容已清除';
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    });

    // 新建文档
    newDocumentButton.addEventListener('click', () => {
        const newDocument = {
            name: `文档${documents.length + 1}`,
            content: '',
            timestamp: Date.now()
        };
        documents.push(newDocument);
        localStorage.setItem('documents', JSON.stringify(documents));
        currentDocumentIndex = documents.length - 1;
        loadDocument(currentDocumentIndex);
        message.textContent = '新建文档成功';
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    });

    // 导出文档
    exportButton.addEventListener('click', () => {
        const document = documents[currentDocumentIndex];
        if (document && document.content) {
            const content = document.content;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = document.name || '文档.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            message.textContent = '文档已导出';
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        } else {
            message.textContent = '文档内容为空，无法导出';
            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        }
    });
});
