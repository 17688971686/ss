//// Generated from G:/resources/workspace1/ϵͳ�����ܹ�/sn-core/src/test/resources\OdataFilter.g4 by ANTLR 4.7
//
//package cs.repository.odata.antlr;
//
//import org.antlr.v4.runtime.Lexer;
//import org.antlr.v4.runtime.CharStream;
//import org.antlr.v4.runtime.Token;
//import org.antlr.v4.runtime.TokenStream;
//import org.antlr.v4.runtime.*;
//import org.antlr.v4.runtime.atn.*;
//import org.antlr.v4.runtime.dfa.DFA;
//import org.antlr.v4.runtime.misc.*;
//
//@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
//public class OdataFilterLexer extends Lexer {
//	static { RuntimeMetaData.checkVersion("4.7", RuntimeMetaData.VERSION); }
//
//	protected static final DFA[] _decisionToDFA;
//	protected static final PredictionContextCache _sharedContextCache =
//		new PredictionContextCache();
//	public static final int
//		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9,
//		T__9=10, T__10=11, T__11=12, T__12=13, T__13=14, T__14=15, T__15=16, T__16=17,
//		T__17=18, T__18=19, T__19=20, T__20=21, T__21=22, T__22=23, T__23=24,
//		T__24=25, T__25=26, WORD=27, DATATIME=28, STRING=29, NUMBER=30, WS=31;
//	public static String[] channelNames = {
//		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
//	};
//
//	public static String[] modeNames = {
//		"DEFAULT_MODE"
//	};
//
//	public static final String[] ruleNames = {
//		"T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", "T__7", "T__8",
//		"T__9", "T__10", "T__11", "T__12", "T__13", "T__14", "T__15", "T__16",
//		"T__17", "T__18", "T__19", "T__20", "T__21", "T__22", "T__23", "T__24",
//		"T__25", "WORD", "DATATIME", "STRING", "NUMBER", "INT", "EXP", "WS"
//	};
//
//	private static final String[] _LITERAL_NAMES = {
//		null, "'OR'", "'or'", "'AND'", "'and'", "'('", "')'", "'substringof('",
//		"'contains('", "','", "'endswith('", "'startswith('", "'indexof('", "') eq -1'",
//		"'eq'", "'ne'", "'gt'", "'ge'", "'lt'", "'le'", "'ni'", "'in'", "'endswith'",
//		"'startswith'", "'true'", "'false'", "'null'"
//	};
//	private static final String[] _SYMBOLIC_NAMES = {
//		null, null, null, null, null, null, null, null, null, null, null, null,
//		null, null, null, null, null, null, null, null, null, null, null, null,
//		null, null, null, "WORD", "DATATIME", "STRING", "NUMBER", "WS"
//	};
//	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);
//
//	/**
//	 * @deprecated Use {@link #VOCABULARY} instead.
//	 */
//	@Deprecated
//	public static final String[] tokenNames;
//	static {
//		tokenNames = new String[_SYMBOLIC_NAMES.length];
//		for (int i = 0; i < tokenNames.length; i++) {
//			tokenNames[i] = VOCABULARY.getLiteralName(i);
//			if (tokenNames[i] == null) {
//				tokenNames[i] = VOCABULARY.getSymbolicName(i);
//			}
//
//			if (tokenNames[i] == null) {
//				tokenNames[i] = "<INVALID>";
//			}
//		}
//	}
//
//	@Override
//	@Deprecated
//	public String[] getTokenNames() {
//		return tokenNames;
//	}
//
//	@Override
//
//	public Vocabulary getVocabulary() {
//		return VOCABULARY;
//	}
//
//
//	public OdataFilterLexer(CharStream input) {
//		super(input);
//		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
//	}
//
//	@Override
//	public String getGrammarFileName() { return "OdataFilter.g4"; }
//
//	@Override
//	public String[] getRuleNames() { return ruleNames; }
//
//	@Override
//	public String getSerializedATN() { return _serializedATN; }
//
//	@Override
//	public String[] getChannelNames() { return channelNames; }
//
//	@Override
//	public String[] getModeNames() { return modeNames; }
//
//	@Override
//	public ATN getATN() { return _ATN; }
//
//	public static final String _serializedATN =
//		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2!\u0122\b\1\4\2\t"+
//		"\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13"+
//		"\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
//		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
//		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
//		"\t!\4\"\t\"\3\2\3\2\3\2\3\3\3\3\3\3\3\4\3\4\3\4\3\4\3\5\3\5\3\5\3\5\3"+
//		"\6\3\6\3\7\3\7\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\t"+
//		"\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\t\3\n\3\n\3\13\3\13\3\13\3\13\3\13"+
//		"\3\13\3\13\3\13\3\13\3\13\3\f\3\f\3\f\3\f\3\f\3\f\3\f\3\f\3\f\3\f\3\f"+
//		"\3\f\3\r\3\r\3\r\3\r\3\r\3\r\3\r\3\r\3\r\3\16\3\16\3\16\3\16\3\16\3\16"+
//		"\3\16\3\16\3\17\3\17\3\17\3\20\3\20\3\20\3\21\3\21\3\21\3\22\3\22\3\22"+
//		"\3\23\3\23\3\23\3\24\3\24\3\24\3\25\3\25\3\25\3\26\3\26\3\26\3\27\3\27"+
//		"\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\30\3\30\3\30\3\30\3\30\3\30\3\30"+
//		"\3\30\3\30\3\30\3\30\3\31\3\31\3\31\3\31\3\31\3\32\3\32\3\32\3\32\3\32"+
//		"\3\32\3\33\3\33\3\33\3\33\3\33\3\34\6\34\u00d5\n\34\r\34\16\34\u00d6\3"+
//		"\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\3\35\6\35\u00e4\n\35"+
//		"\r\35\16\35\u00e5\3\35\3\35\3\36\3\36\7\36\u00ec\n\36\f\36\16\36\u00ef"+
//		"\13\36\3\36\3\36\3\37\5\37\u00f4\n\37\3\37\3\37\3\37\6\37\u00f9\n\37\r"+
//		"\37\16\37\u00fa\3\37\5\37\u00fe\n\37\3\37\5\37\u0101\n\37\3\37\3\37\3"+
//		"\37\3\37\5\37\u0107\n\37\3\37\5\37\u010a\n\37\3 \3 \3 \7 \u010f\n \f "+
//		"\16 \u0112\13 \5 \u0114\n \3!\3!\5!\u0118\n!\3!\3!\3\"\6\"\u011d\n\"\r"+
//		"\"\16\"\u011e\3\"\3\"\2\2#\3\3\5\4\7\5\t\6\13\7\r\b\17\t\21\n\23\13\25"+
//		"\f\27\r\31\16\33\17\35\20\37\21!\22#\23%\24\'\25)\26+\27-\30/\31\61\32"+
//		"\63\33\65\34\67\359\36;\37= ?\2A\2C!\3\2\t\7\2--\60;C\\aac|\3\2))\3\2"+
//		"\62;\3\2\63;\4\2GGgg\4\2--//\6\2\13\f\17\17\"\"..\2\u012d\2\3\3\2\2\2"+
//		"\2\5\3\2\2\2\2\7\3\2\2\2\2\t\3\2\2\2\2\13\3\2\2\2\2\r\3\2\2\2\2\17\3\2"+
//		"\2\2\2\21\3\2\2\2\2\23\3\2\2\2\2\25\3\2\2\2\2\27\3\2\2\2\2\31\3\2\2\2"+
//		"\2\33\3\2\2\2\2\35\3\2\2\2\2\37\3\2\2\2\2!\3\2\2\2\2#\3\2\2\2\2%\3\2\2"+
//		"\2\2\'\3\2\2\2\2)\3\2\2\2\2+\3\2\2\2\2-\3\2\2\2\2/\3\2\2\2\2\61\3\2\2"+
//		"\2\2\63\3\2\2\2\2\65\3\2\2\2\2\67\3\2\2\2\29\3\2\2\2\2;\3\2\2\2\2=\3\2"+
//		"\2\2\2C\3\2\2\2\3E\3\2\2\2\5H\3\2\2\2\7K\3\2\2\2\tO\3\2\2\2\13S\3\2\2"+
//		"\2\rU\3\2\2\2\17W\3\2\2\2\21d\3\2\2\2\23n\3\2\2\2\25p\3\2\2\2\27z\3\2"+
//		"\2\2\31\u0086\3\2\2\2\33\u008f\3\2\2\2\35\u0097\3\2\2\2\37\u009a\3\2\2"+
//		"\2!\u009d\3\2\2\2#\u00a0\3\2\2\2%\u00a3\3\2\2\2\'\u00a6\3\2\2\2)\u00a9"+
//		"\3\2\2\2+\u00ac\3\2\2\2-\u00af\3\2\2\2/\u00b8\3\2\2\2\61\u00c3\3\2\2\2"+
//		"\63\u00c8\3\2\2\2\65\u00ce\3\2\2\2\67\u00d4\3\2\2\29\u00d8\3\2\2\2;\u00e9"+
//		"\3\2\2\2=\u0109\3\2\2\2?\u0113\3\2\2\2A\u0115\3\2\2\2C\u011c\3\2\2\2E"+
//		"F\7Q\2\2FG\7T\2\2G\4\3\2\2\2HI\7q\2\2IJ\7t\2\2J\6\3\2\2\2KL\7C\2\2LM\7"+
//		"P\2\2MN\7F\2\2N\b\3\2\2\2OP\7c\2\2PQ\7p\2\2QR\7f\2\2R\n\3\2\2\2ST\7*\2"+
//		"\2T\f\3\2\2\2UV\7+\2\2V\16\3\2\2\2WX\7u\2\2XY\7w\2\2YZ\7d\2\2Z[\7u\2\2"+
//		"[\\\7v\2\2\\]\7t\2\2]^\7k\2\2^_\7p\2\2_`\7i\2\2`a\7q\2\2ab\7h\2\2bc\7"+
//		"*\2\2c\20\3\2\2\2de\7e\2\2ef\7q\2\2fg\7p\2\2gh\7v\2\2hi\7c\2\2ij\7k\2"+
//		"\2jk\7p\2\2kl\7u\2\2lm\7*\2\2m\22\3\2\2\2no\7.\2\2o\24\3\2\2\2pq\7g\2"+
//		"\2qr\7p\2\2rs\7f\2\2st\7u\2\2tu\7y\2\2uv\7k\2\2vw\7v\2\2wx\7j\2\2xy\7"+
//		"*\2\2y\26\3\2\2\2z{\7u\2\2{|\7v\2\2|}\7c\2\2}~\7t\2\2~\177\7v\2\2\177"+
//		"\u0080\7u\2\2\u0080\u0081\7y\2\2\u0081\u0082\7k\2\2\u0082\u0083\7v\2\2"+
//		"\u0083\u0084\7j\2\2\u0084\u0085\7*\2\2\u0085\30\3\2\2\2\u0086\u0087\7"+
//		"k\2\2\u0087\u0088\7p\2\2\u0088\u0089\7f\2\2\u0089\u008a\7g\2\2\u008a\u008b"+
//		"\7z\2\2\u008b\u008c\7q\2\2\u008c\u008d\7h\2\2\u008d\u008e\7*\2\2\u008e"+
//		"\32\3\2\2\2\u008f\u0090\7+\2\2\u0090\u0091\7\"\2\2\u0091\u0092\7g\2\2"+
//		"\u0092\u0093\7s\2\2\u0093\u0094\7\"\2\2\u0094\u0095\7/\2\2\u0095\u0096"+
//		"\7\63\2\2\u0096\34\3\2\2\2\u0097\u0098\7g\2\2\u0098\u0099\7s\2\2\u0099"+
//		"\36\3\2\2\2\u009a\u009b\7p\2\2\u009b\u009c\7g\2\2\u009c \3\2\2\2\u009d"+
//		"\u009e\7i\2\2\u009e\u009f\7v\2\2\u009f\"\3\2\2\2\u00a0\u00a1\7i\2\2\u00a1"+
//		"\u00a2\7g\2\2\u00a2$\3\2\2\2\u00a3\u00a4\7n\2\2\u00a4\u00a5\7v\2\2\u00a5"+
//		"&\3\2\2\2\u00a6\u00a7\7n\2\2\u00a7\u00a8\7g\2\2\u00a8(\3\2\2\2\u00a9\u00aa"+
//		"\7p\2\2\u00aa\u00ab\7k\2\2\u00ab*\3\2\2\2\u00ac\u00ad\7k\2\2\u00ad\u00ae"+
//		"\7p\2\2\u00ae,\3\2\2\2\u00af\u00b0\7g\2\2\u00b0\u00b1\7p\2\2\u00b1\u00b2"+
//		"\7f\2\2\u00b2\u00b3\7u\2\2\u00b3\u00b4\7y\2\2\u00b4\u00b5\7k\2\2\u00b5"+
//		"\u00b6\7v\2\2\u00b6\u00b7\7j\2\2\u00b7.\3\2\2\2\u00b8\u00b9\7u\2\2\u00b9"+
//		"\u00ba\7v\2\2\u00ba\u00bb\7c\2\2\u00bb\u00bc\7t\2\2\u00bc\u00bd\7v\2\2"+
//		"\u00bd\u00be\7u\2\2\u00be\u00bf\7y\2\2\u00bf\u00c0\7k\2\2\u00c0\u00c1"+
//		"\7v\2\2\u00c1\u00c2\7j\2\2\u00c2\60\3\2\2\2\u00c3\u00c4\7v\2\2\u00c4\u00c5"+
//		"\7t\2\2\u00c5\u00c6\7w\2\2\u00c6\u00c7\7g\2\2\u00c7\62\3\2\2\2\u00c8\u00c9"+
//		"\7h\2\2\u00c9\u00ca\7c\2\2\u00ca\u00cb\7n\2\2\u00cb\u00cc\7u\2\2\u00cc"+
//		"\u00cd\7g\2\2\u00cd\64\3\2\2\2\u00ce\u00cf\7p\2\2\u00cf\u00d0\7w\2\2\u00d0"+
//		"\u00d1\7n\2\2\u00d1\u00d2\7n\2\2\u00d2\66\3\2\2\2\u00d3\u00d5\t\2\2\2"+
//		"\u00d4\u00d3\3\2\2\2\u00d5\u00d6\3\2\2\2\u00d6\u00d4\3\2\2\2\u00d6\u00d7"+
//		"\3\2\2\2\u00d78\3\2\2\2\u00d8\u00d9\7f\2\2\u00d9\u00da\7c\2\2\u00da\u00db"+
//		"\7v\2\2\u00db\u00dc\7g\2\2\u00dc\u00dd\7v\2\2\u00dd\u00de\7k\2\2\u00de"+
//		"\u00df\7o\2\2\u00df\u00e0\7g\2\2\u00e0\u00e1\7)\2\2\u00e1\u00e3\3\2\2"+
//		"\2\u00e2\u00e4\n\3\2\2\u00e3\u00e2\3\2\2\2\u00e4\u00e5\3\2\2\2\u00e5\u00e3"+
//		"\3\2\2\2\u00e5\u00e6\3\2\2\2\u00e6\u00e7\3\2\2\2\u00e7\u00e8\7)\2\2\u00e8"+
//		":\3\2\2\2\u00e9\u00ed\7)\2\2\u00ea\u00ec\n\3\2\2\u00eb\u00ea\3\2\2\2\u00ec"+
//		"\u00ef\3\2\2\2\u00ed\u00eb\3\2\2\2\u00ed\u00ee\3\2\2\2\u00ee\u00f0\3\2"+
//		"\2\2\u00ef\u00ed\3\2\2\2\u00f0\u00f1\7)\2\2\u00f1<\3\2\2\2\u00f2\u00f4"+
//		"\7/\2\2\u00f3\u00f2\3\2\2\2\u00f3\u00f4\3\2\2\2\u00f4\u00f5\3\2\2\2\u00f5"+
//		"\u00f6\5? \2\u00f6\u00f8\7\60\2\2\u00f7\u00f9\t\4\2\2\u00f8\u00f7\3\2"+
//		"\2\2\u00f9\u00fa\3\2\2\2\u00fa\u00f8\3\2\2\2\u00fa\u00fb\3\2\2\2\u00fb"+
//		"\u00fd\3\2\2\2\u00fc\u00fe\5A!\2\u00fd\u00fc\3\2\2\2\u00fd\u00fe\3\2\2"+
//		"\2\u00fe\u010a\3\2\2\2\u00ff\u0101\7/\2\2\u0100\u00ff\3\2\2\2\u0100\u0101"+
//		"\3\2\2\2\u0101\u0102\3\2\2\2\u0102\u0103\5? \2\u0103\u0104\5A!\2\u0104"+
//		"\u010a\3\2\2\2\u0105\u0107\7/\2\2\u0106\u0105\3\2\2\2\u0106\u0107\3\2"+
//		"\2\2\u0107\u0108\3\2\2\2\u0108\u010a\5? \2\u0109\u00f3\3\2\2\2\u0109\u0100"+
//		"\3\2\2\2\u0109\u0106\3\2\2\2\u010a>\3\2\2\2\u010b\u0114\7\62\2\2\u010c"+
//		"\u0110\t\5\2\2\u010d\u010f\t\4\2\2\u010e\u010d\3\2\2\2\u010f\u0112\3\2"+
//		"\2\2\u0110\u010e\3\2\2\2\u0110\u0111\3\2\2\2\u0111\u0114\3\2\2\2\u0112"+
//		"\u0110\3\2\2\2\u0113\u010b\3\2\2\2\u0113\u010c\3\2\2\2\u0114@\3\2\2\2"+
//		"\u0115\u0117\t\6\2\2\u0116\u0118\t\7\2\2\u0117\u0116\3\2\2\2\u0117\u0118"+
//		"\3\2\2\2\u0118\u0119\3\2\2\2\u0119\u011a\5? \2\u011aB\3\2\2\2\u011b\u011d"+
//		"\t\b\2\2\u011c\u011b\3\2\2\2\u011d\u011e\3\2\2\2\u011e\u011c\3\2\2\2\u011e"+
//		"\u011f\3\2\2\2\u011f\u0120\3\2\2\2\u0120\u0121\b\"\2\2\u0121D\3\2\2\2"+
//		"\20\2\u00d6\u00e5\u00ed\u00f3\u00fa\u00fd\u0100\u0106\u0109\u0110\u0113"+
//		"\u0117\u011e\3\b\2\2";
//	public static final ATN _ATN =
//		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
//	static {
//		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
//		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
//			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
//		}
//	}
//}