// src/CodeEditor.js
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios'; // Import Axios here

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-github';

import ace from 'ace-builds';

ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/'); // Set base path for modes

const CodeEditor = () => {
    const [code, setCode] = useState('print("Hello, World!")');
    const [language, setLanguage] = useState('python3');
    const [output, setOutput] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/compile', {
                code,
                language,
            });
            setOutput(response.data.output || response.data.error);
        } catch (error) {
            setOutput('Error: ' + error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            <div style={{ padding: '10px', background: '#f1f1f1' }}>
                <h2>Code Compiler</h2>
                <select onChange={(e) => setLanguage(e.target.value)} value={language}>
                    <option value="python3">Python 3</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="nodejs">Node.js</option>
                    <option value="c">C</option>
                    <option value="csharp">C#</option>
                </select>
                <button onClick={handleSubmit}>Run Code</button>
            </div>
            <AceEditor
                mode={language === 'cpp' ? 'c_cpp' : language === 'java' ? 'java' : language === 'nodejs' ? 'javascript' : language}
                theme="github"
                name="codeEditor"
                onChange={setCode}
                value={code}
                editorProps={{ $blockScrolling: true }}
                style={{ width: '100%', height: 'calc(100vh - 70px)' }}
            />
            <pre style={{ overflow: 'auto', padding: '10px', background: '#f1f1f1' }}>{output}</pre>
        </div>
    );
};

export default CodeEditor;
    