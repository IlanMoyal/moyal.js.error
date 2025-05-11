## Classes

<dl>
<dt><a href="#MoyalError">MoyalError</a></dt>
<dd><p>Custom error class with nested error support.
Automatically uses native <code>cause</code> if supported, otherwise simulates it.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#MoyalError.">MoyalError.()</a> ⇒ <code>boolean</code></dt>
<dd><p>Tests if the current runtime supports native Error <code>cause</code> (ES2022).</p>
</dd>
<dt><a href="#MoyalError.">MoyalError.(str)</a> ⇒ <code>string</code></dt>
<dd><p>Indents all lines with a tab.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#MoyalErrorJSON">MoyalErrorJSON</a> : <code>object</code></dt>
<dd></dd>
</dl>

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

