ace.define("ace/mode/xml_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var XmlHighlightRules = function (normalize) {
    var tagRegex = "[_:a-zA-Z\xc0-\uffff][-_:.a-zA-Z0-9\xc0-\uffff]*";
    this.$rules = {
        start: [
            { token: "string.cdata.xml", regex: "<\\!\\[CDATA\\[", next: "cdata" },
            {
                token: ["punctuation.instruction.xml", "keyword.instruction.xml"],
                regex: "(<\\?)(" + tagRegex + ")", next: "processing_instruction"
            },
            { token: "comment.start.xml", regex: "<\\!--", next: "comment" },
            {
                token: ["xml-pe.doctype.xml", "xml-pe.doctype.xml"],
                regex: "(<\\!)(DOCTYPE)(?=[\\s])", next: "doctype", caseInsensitive: true
            },
            { include: "tag" },
            { token: "text.end-tag-open.xml", regex: "</" },
            { token: "text.tag-open.xml", regex: "<" },
            { include: "reference" },
            { defaultToken: "text.xml" }
        ],
        processing_instruction: [{
                token: "entity.other.attribute-name.decl-attribute-name.xml",
                regex: tagRegex
            }, {
                token: "keyword.operator.decl-attribute-equals.xml",
                regex: "="
            }, {
                include: "whitespace"
            }, {
                include: "string"
            }, {
                token: "punctuation.xml-decl.xml",
                regex: "\\?>",
                next: "start"
            }],
        doctype: [
            { include: "whitespace" },
            { include: "string" },
            { token: "xml-pe.doctype.xml", regex: ">", next: "start" },
            { token: "xml-pe.xml", regex: "[-_a-zA-Z0-9:]+" },
            { token: "punctuation.int-subset", regex: "\\[", push: "int_subset" }
        ],
        int_subset: [{
                token: "text.xml",
                regex: "\\s+"
            }, {
                token: "punctuation.int-subset.xml",
                regex: "]",
                next: "pop"
            }, {
                token: ["punctuation.markup-decl.xml", "keyword.markup-decl.xml"],
                regex: "(<\\!)(" + tagRegex + ")",
                push: [{
                        token: "text",
                        regex: "\\s+"
                    },
                    {
                        token: "punctuation.markup-decl.xml",
                        regex: ">",
                        next: "pop"
                    },
                    { include: "string" }]
            }],
        cdata: [
            { token: "string.cdata.xml", regex: "\\]\\]>", next: "start" },
            { token: "text.xml", regex: "\\s+" },
            { token: "text.xml", regex: "(?:[^\\]]|\\](?!\\]>))+" }
        ],
        comment: [
            { token: "comment.end.xml", regex: "-->", next: "start" },
            { defaultToken: "comment.xml" }
        ],
        reference: [{
                token: "constant.language.escape.reference.xml",
                regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
            }],
        attr_reference: [{
                token: "constant.language.escape.reference.attribute-value.xml",
                regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
            }],
        tag: [{
                token: ["meta.tag.punctuation.tag-open.xml", "meta.tag.punctuation.end-tag-open.xml", "meta.tag.tag-name.xml"],
                regex: "(?:(<)|(</))((?:" + tagRegex + ":)?" + tagRegex + ")",
                next: [
                    { include: "attributes" },
                    { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start" }
                ]
            }],
        tag_whitespace: [
            { token: "text.tag-whitespace.xml", regex: "\\s+" }
        ],
        whitespace: [
            { token: "text.whitespace.xml", regex: "\\s+" }
        ],
        string: [{
                token: "string.xml",
                regex: "'",
                push: [
                    { token: "string.xml", regex: "'", next: "pop" },
                    { defaultToken: "string.xml" }
                ]
            }, {
                token: "string.xml",
                regex: '"',
                push: [
                    { token: "string.xml", regex: '"', next: "pop" },
                    { defaultToken: "string.xml" }
                ]
            }],
        attributes: [{
                token: "entity.other.attribute-name.xml",
                regex: tagRegex
            }, {
                token: "keyword.operator.attribute-equals.xml",
                regex: "="
            }, {
                include: "tag_whitespace"
            }, {
                include: "attribute_value"
            }],
        attribute_value: [{
                token: "string.attribute-value.xml",
                regex: "'",
                push: [
                    { token: "string.attribute-value.xml", regex: "'", next: "pop" },
                    { include: "attr_reference" },
                    { defaultToken: "string.attribute-value.xml" }
                ]
            }, {
                token: "string.attribute-value.xml",
                regex: '"',
                push: [
                    { token: "string.attribute-value.xml", regex: '"', next: "pop" },
                    { include: "attr_reference" },
                    { defaultToken: "string.attribute-value.xml" }
                ]
            }]
    };
    if (this.constructor === XmlHighlightRules)
        this.normalizeRules();
};
(function () {
    this.embedTagRules = function (HighlightRules, prefix, tag) {
        this.$rules.tag.unshift({
            token: ["meta.tag.punctuation.tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
            regex: "(<)(" + tag + "(?=\\s|>|$))",
            next: [
                { include: "attributes" },
                { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: prefix + "start" }
            ]
        });
        this.$rules[tag + "-end"] = [
            { include: "attributes" },
            { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start",
                onMatch: function (value, currentState, stack) {
                    stack.splice(0);
                    return this.token;
                } }
        ];
        this.embedRules(HighlightRules, prefix, [{
                token: ["meta.tag.punctuation.end-tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
                regex: "(</)(" + tag + "(?=\\s|>|$))",
                next: tag + "-end"
            }, {
                token: "string.cdata.xml",
                regex: "<\\!\\[CDATA\\["
            }, {
                token: "string.cdata.xml",
                regex: "\\]\\]>"
            }]);
    };
}).call(TextHighlightRules.prototype);
oop.inherits(XmlHighlightRules, TextHighlightRules);
exports.XmlHighlightRules = XmlHighlightRules;

});

ace.define("ace/mode/behaviour/xml",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"], function(require, exports, module){"use strict";
var oop = require("../../lib/oop");
var Behaviour = require("../behaviour").Behaviour;
var TokenIterator = require("../../token_iterator").TokenIterator;
var lang = require("../../lib/lang");
function is(token, type) {
    return token && token.type.lastIndexOf(type + ".xml") > -1;
}
var XmlBehaviour = function () {
    this.add("string_dquotes", "insertion", function (state, action, editor, session, text) {
        if (text == '"' || text == "'") {
            var quote = text;
            var selected = session.doc.getTextRange(editor.getSelectionRange());
            if (selected !== "" && selected !== "'" && selected != '"' && editor.getWrapBehavioursEnabled()) {
                return {
                    text: quote + selected + quote,
                    selection: false
                };
            }
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            var rightChar = line.substring(cursor.column, cursor.column + 1);
            var iterator = new TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();
            if (rightChar == quote && (is(token, "attribute-value") || is(token, "string"))) {
                return {
                    text: "",
                    selection: [1, 1]
                };
            }
            if (!token)
                token = iterator.stepBackward();
            if (!token)
                return;
            while (is(token, "tag-whitespace") || is(token, "whitespace")) {
                token = iterator.stepBackward();
            }
            var rightSpace = !rightChar || rightChar.match(/\s/);
            if (is(token, "attribute-equals") && (rightSpace || rightChar == '>') || (is(token, "decl-attribute-equals") && (rightSpace || rightChar == '?'))) {
                return {
                    text: quote + quote,
                    selection: [1, 1]
                };
            }
        }
    });
    this.add("string_dquotes", "deletion", function (state, action, editor, session, range) {
        var selected = session.doc.getTextRange(range);
        if (!range.isMultiLine() && (selected == '"' || selected == "'")) {
            var line = session.doc.getLine(range.start.row);
            var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
            if (rightChar == selected) {
                range.end.column++;
                return range;
            }
        }
    });
    this.add("autoclosing", "insertion", function (state, action, editor, session, text) {
        if (text == '>') {
            var position = editor.getSelectionRange().start;
            var iterator = new TokenIterator(session, position.row, position.column);
            var token = iterator.getCurrentToken() || iterator.stepBackward();
            if (!token || !(is(token, "tag-name") || is(token, "tag-whitespace") || is(token, "attribute-name") || is(token, "attribute-equals") || is(token, "attribute-value")))
                return;
            if (is(token, "reference.attribute-value"))
                return;
            if (is(token, "attribute-value")) {
                var tokenEndColumn = iterator.getCurrentTokenColumn() + token.value.length;
                if (position.column < tokenEndColumn)
                    return;
                if (position.column == tokenEndColumn) {
                    var nextToken = iterator.stepForward();
                    if (nextToken && is(nextToken, "attribute-value"))
                        return;
                    iterator.stepBackward();
                }
            }
            if (/^\s*>/.test(session.getLine(position.row).slice(position.column)))
                return;
            while (!is(token, "tag-name")) {
                token = iterator.stepBackward();
                if (token.value == "<") {
                    token = iterator.stepForward();
                    break;
                }
            }
            var tokenRow = iterator.getCurrentTokenRow();
            var tokenColumn = iterator.getCurrentTokenColumn();
            if (is(iterator.stepBackward(), "end-tag-open"))
                return;
            var element = token.value;
            if (tokenRow == position.row)
                element = element.substring(0, position.column - tokenColumn);
            if (this.voidElements.hasOwnProperty(element.toLowerCase()))
                return;
            return {
                text: ">" + "</" + element + ">",
                selection: [1, 1]
            };
        }
    });
    this.add("autoindent", "insertion", function (state, action, editor, session, text) {
        if (text == "\n") {
            var cursor = editor.getCursorPosition();
            var line = session.getLine(cursor.row);
            var iterator = new TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();
            if (token && token.type.indexOf("tag-close") !== -1) {
                if (token.value == "/>")
                    return;
                while (token && token.type.indexOf("tag-name") === -1) {
                    token = iterator.stepBackward();
                }
                if (!token) {
                    return;
                }
                var tag = token.value;
                var row = iterator.getCurrentTokenRow();
                token = iterator.stepBackward();
                if (!token || token.type.indexOf("end-tag") !== -1) {
                    return;
                }
                if (this.voidElements && !this.voidElements[tag]) {
                    var nextToken = session.getTokenAt(cursor.row, cursor.column + 1);
                    var line = session.getLine(row);
                    var nextIndent = this.$getIndent(line);
                    var indent = nextIndent + session.getTabString();
                    if (nextToken && nextToken.value === "</") {
                        return {
                            text: "\n" + indent + "\n" + nextIndent,
                            selection: [1, indent.length, 1, indent.length]
                        };
                    }
                    else {
                        return {
                            text: "\n" + indent
                        };
                    }
                }
            }
        }
    });
};
oop.inherits(XmlBehaviour, Behaviour);
exports.XmlBehaviour = XmlBehaviour;

});

ace.define("ace/mode/folding/xml",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module){"use strict";
var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;
var FoldMode = exports.FoldMode = function (voidElements, optionalEndTags) {
    BaseFoldMode.call(this);
    this.voidElements = voidElements || {};
    this.optionalEndTags = oop.mixin({}, this.voidElements);
    if (optionalEndTags)
        oop.mixin(this.optionalEndTags, optionalEndTags);
};
oop.inherits(FoldMode, BaseFoldMode);
var Tag = function () {
    this.tagName = "";
    this.closing = false;
    this.selfClosing = false;
    this.start = { row: 0, column: 0 };
    this.end = { row: 0, column: 0 };
};
function is(token, type) {
    return token.type.lastIndexOf(type + ".xml") > -1;
}
(function () {
    this.getFoldWidget = function (session, foldStyle, row) {
        var tag = this._getFirstTagInLine(session, row);
        if (!tag)
            return this.getCommentFoldWidget(session, row);
        if (tag.closing || (!tag.tagName && tag.selfClosing))
            return foldStyle === "markbeginend" ? "end" : "";
        if (!tag.tagName || tag.selfClosing || this.voidElements.hasOwnProperty(tag.tagName.toLowerCase()))
            return "";
        if (this._findEndTagInLine(session, row, tag.tagName, tag.end.column))
            return "";
        return "start";
    };
    this.getCommentFoldWidget = function (session, row) {
        if (/comment/.test(session.getState(row)) && /<!-/.test(session.getLine(row)))
            return "start";
        return "";
    };
    this._getFirstTagInLine = function (session, row) {
        var tokens = session.getTokens(row);
        var tag = new Tag();
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (is(token, "tag-open")) {
                tag.end.column = tag.start.column + token.value.length;
                tag.closing = is(token, "end-tag-open");
                token = tokens[++i];
                if (!token)
                    return null;
                tag.tagName = token.value;
                tag.end.column += token.value.length;
                for (i++; i < tokens.length; i++) {
                    token = tokens[i];
                    tag.end.column += token.value.length;
                    if (is(token, "tag-close")) {
                        tag.selfClosing = token.value == '/>';
                        break;
                    }
                }
                return tag;
            }
            else if (is(token, "tag-close")) {
                tag.selfClosing = token.value == '/>';
                return tag;
            }
            tag.start.column += token.value.length;
        }
        return null;
    };
    this._findEndTagInLine = function (session, row, tagName, startColumn) {
        var tokens = session.getTokens(row);
        var column = 0;
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            column += token.value.length;
            if (column < startColumn)
                continue;
            if (is(token, "end-tag-open")) {
                token = tokens[i + 1];
                if (token && token.value == tagName)
                    return true;
            }
        }
        return false;
    };
    this.getFoldWidgetRange = function (session, foldStyle, row) {
        var tags = session.getMatchingTags({ row: row, column: 0 });
        if (tags) {
            return new Range(tags.openTag.end.row, tags.openTag.end.column, tags.closeTag.start.row, tags.closeTag.start.column);
        }
        else {
            return this.getCommentFoldWidget(session, row)
                && session.getCommentFoldRange(row, session.getLine(row).length);
        }
    };
}).call(FoldMode.prototype);

});

ace.define("ace/mode/xml",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text","ace/mode/xml_highlight_rules","ace/mode/behaviour/xml","ace/mode/folding/xml","ace/worker/worker_client"], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextMode = require("./text").Mode;
var XmlHighlightRules = require("./xml_highlight_rules").XmlHighlightRules;
var XmlBehaviour = require("./behaviour/xml").XmlBehaviour;
var XmlFoldMode = require("./folding/xml").FoldMode;
var WorkerClient = require("../worker/worker_client").WorkerClient;
var Mode = function () {
    this.HighlightRules = XmlHighlightRules;
    this.$behaviour = new XmlBehaviour();
    this.foldingRules = new XmlFoldMode();
};
oop.inherits(Mode, TextMode);
(function () {
    this.voidElements = lang.arrayToMap([]);
    this.blockComment = { start: "<!--", end: "-->" };
    this.createWorker = function (session) {
        var worker = new WorkerClient(["ace"], "ace/mode/xml_worker", "Worker");
        worker.attachToDocument(session.getDocument());
        worker.on("error", function (e) {
            session.setAnnotations(e.data);
        });
        worker.on("terminate", function () {
            session.clearAnnotations();
        });
        return worker;
    };
    this.$id = "ace/mode/xml";
}).call(Mode.prototype);
exports.Mode = Mode;

});                (function() {
                    ace.require(["ace/mode/xml"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();