## Classes

<dl>
<dt><a href="#MoyalError">MoyalError</a></dt>
<dd><p>Custom error class with nested error support.
Automatically uses native <code>cause</code> if supported, otherwise simulates it.</p>
</dd>
<dt><a href="#ArgumentError">ArgumentError</a> ⇐ <code><a href="#MoyalError">MoyalError</a></code></dt>
<dd><p>Represents an error caused by invalid or missing function arguments.
Inherits from <code>MoyalError</code>.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#version">version()</a> ⇒ <code>string</code></dt>
<dd><p>Returns the semantic version of this library.</p>
</dd>
<dt><a href="#MoyalError.">MoyalError.()</a> ⇒ <code>boolean</code></dt>
<dd><p>Tests if the current runtime supports native Error <code>cause</code> (ES2022).</p>
</dd>
<dt><a href="#MoyalError.">MoyalError.(str)</a> ⇒ <code>string</code></dt>
<dd><p>Indents all lines with a tab.</p>
</dd>
<dt><a href="#printCauseChain">printCauseChain(error)</a> ⇒ <code>string</code></dt>
<dd><p>Builds a readable, indented summary of the cause chain.</p>
</dd>
<dt><a href="#extendNativeError">extendNativeError()</a></dt>
<dd><p>Extends the native Javascript Error type to contain toJSON function.</p>
</dd>
<dt><a href="#throwIfNull">throwIfNull(value, [argumentName])</a></dt>
<dd><p>Throws an <a href="#ArgumentError">ArgumentError</a> if the given value is <code>null</code>.</p>
</dd>
<dt><a href="#throwIfUndefined">throwIfUndefined(value, [argumentName])</a></dt>
<dd><p>Throws an <a href="#ArgumentError">ArgumentError</a> if the given value is <code>undefined</code>.</p>
</dd>
<dt><a href="#throwIfNullOrUndefined">throwIfNullOrUndefined(value, [argumentName])</a></dt>
<dd><p>Throws an <a href="#ArgumentError">ArgumentError</a> if the given value is <code>null</code> or <code>undefined</code>.</p>
</dd>
<dt><a href="#throwMissingArgument">throwMissingArgument([argumentName])</a></dt>
<dd><p>Always throws an <a href="#ArgumentError">ArgumentError</a> indicating a required argument is missing.</p>
</dd>
<dt><a href="#throwIfEmptyString">throwIfEmptyString(value, [argumentName])</a></dt>
<dd><p>Throws an <a href="#ArgumentError">ArgumentError</a> if the given value is an empty string.</p>
</dd>
<dt><a href="#throwIfNullOrWhitespace">throwIfNullOrWhitespace(value, [argumentName])</a></dt>
<dd><p>Throws an <a href="#ArgumentError">ArgumentError</a> if the given value is <code>null</code>, <code>undefined</code>,
or a string that is empty or only whitespace.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#MoyalErrorJSON">MoyalErrorJSON</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="version"></a>

## version() ⇒ <code>string</code>
Returns the semantic version of this library.

**Kind**: global function  
**Returns**: <code>string</code> - - The semantic version of this library.  
<a name="MoyalError."></a>

## MoyalError.() ⇒ <code>boolean</code>
Tests if the current runtime supports native Error `cause` (ES2022).

**Kind**: global function  
<a name="MoyalError."></a>

## MoyalError.(str) ⇒ <code>string</code>
Indents all lines with a tab.

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="printCauseChain"></a>

## printCauseChain(error) ⇒ <code>string</code>
Builds a readable, indented summary of the cause chain.

**Kind**: global function  
**Returns**: <code>string</code> - A multiline string with each cause indented by depth.  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Error</code> | The error to trace. |

<a name="extendNativeError"></a>

## extendNativeError()
Extends the native Javascript Error type to contain toJSON function.

**Kind**: global function  
<a name="throwIfNull"></a>

## throwIfNull(value, [argumentName])
Throws an [ArgumentError](#ArgumentError) if the given value is `null`.

**Kind**: global function  
**Throws**:

- [<code>ArgumentError</code>](#ArgumentError) 


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |
| [argumentName] | <code>string</code> | The name of the argument being checked. |

<a name="throwIfUndefined"></a>

## throwIfUndefined(value, [argumentName])
Throws an [ArgumentError](#ArgumentError) if the given value is `undefined`.

**Kind**: global function  
**Throws**:

- [<code>ArgumentError</code>](#ArgumentError) 


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |
| [argumentName] | <code>string</code> | The name of the argument being checked. |

<a name="throwIfNullOrUndefined"></a>

## throwIfNullOrUndefined(value, [argumentName])
Throws an [ArgumentError](#ArgumentError) if the given value is `null` or `undefined`.

**Kind**: global function  
**Throws**:

- [<code>ArgumentError</code>](#ArgumentError) 


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |
| [argumentName] | <code>string</code> | The name of the argument being checked. |

<a name="throwMissingArgument"></a>

## throwMissingArgument([argumentName])
Always throws an [ArgumentError](#ArgumentError) indicating a required argument is missing.

**Kind**: global function  
**Throws**:

- [<code>ArgumentError</code>](#ArgumentError) 


| Param | Type | Description |
| --- | --- | --- |
| [argumentName] | <code>string</code> | The name of the missing argument. |

<a name="throwIfEmptyString"></a>

## throwIfEmptyString(value, [argumentName])
Throws an [ArgumentError](#ArgumentError) if the given value is an empty string.

**Kind**: global function  
**Throws**:

- [<code>ArgumentError</code>](#ArgumentError) 


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |
| [argumentName] | <code>string</code> | The name of the argument being checked. |

<a name="throwIfNullOrWhitespace"></a>

## throwIfNullOrWhitespace(value, [argumentName])
Throws an [ArgumentError](#ArgumentError) if the given value is `null`, `undefined`,or a string that is empty or only whitespace.

**Kind**: global function  
**Throws**:

- [<code>ArgumentError</code>](#ArgumentError) 


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |
| [argumentName] | <code>string</code> | The name of the argument being checked. |

<a name="MoyalErrorJSON"></a>

## MoyalErrorJSON : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the error (usually the class name). |
| message | <code>string</code> | The error message. |
| timestamp | <code>string</code> | ISO 8601 timestamp of when the error was created. |
| stack | <code>string</code> \| <code>undefined</code> | The error's stack trace. |
| [cause] | [<code>MoyalErrorJSON</code>](#MoyalErrorJSON) \| <code>object</code> \| <code>string</code> \| <code>null</code> | The nested cause (recursively serialized if available). |
| type | <code>string</code> | The actual class name (e.g., "MoyalError"). |

