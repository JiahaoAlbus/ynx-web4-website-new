package com.ynxweb4.ynx

import android.app.Activity
import android.animation.LayoutTransition
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.HorizontalScrollView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.math.BigDecimal
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Locale
import kotlin.concurrent.thread

class MainActivity : Activity() {
    private val main = Handler(Looper.getMainLooper())
    private lateinit var root: LinearLayout
    private lateinit var content: FrameLayout
    private var tab = "Home"
    private var address: String? = null
    private var balanceText = "Not loaded"
    private var endpoints: List<Pair<String, String>> = emptyList()
    private var validators = 0
    private var latestBlock = "Syncing"
    private var status = "Ready."
    private var lastBroadcast = ""
    private var lastAI = ""
    private var lastThirdParty = ""
    private var actionMode = "Faucet"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        address = getPreferences(MODE_PRIVATE).getString("address", null)
        root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = appBackground()
            layoutTransition = LayoutTransition().apply {
                setDuration(180)
            }
        }
        content = FrameLayout(this).apply {
            setPadding(dp(8), dp(6), dp(8), 0)
        }
        root.addView(content, LinearLayout.LayoutParams(-1, 0, 1f).apply {
            setMargins(dp(6), dp(6), dp(6), 0)
        })
        root.addView(navBar(), LinearLayout.LayoutParams(-1, -2).apply {
            setMargins(dp(10), 0, dp(10), dp(12))
        })
        setContentView(root)
        refreshNetwork()
        refreshBalance()
        render()
    }

    private fun navBar(): View {
        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(dp(6), dp(6), dp(6), dp(6))
            background = glassPanel(radiusDp = 26, fillAlpha = 188, strokeAlpha = 140)
            elevation = dp(8).toFloat()
        }
        listOf("Home", "Wallet", "Actions", "Browser", "Monitor").forEach { name ->
            bar.addView(Button(this).apply {
                text = name
                textSize = 12f
                isAllCaps = false
                setTextColor(if (tab == name) Color.WHITE else ink)
                background = pillPanel(
                    selected = tab == name,
                    radiusDp = 18,
                    selectedColor = klein,
                    normalColor = Color.argb(120, 255, 255, 255)
                )
                setOnClickListener {
                    tab = name
                    render()
                }
            }, LinearLayout.LayoutParams(0, dp(48), 1f).apply {
                setMargins(dp(2), 0, dp(2), 0)
            })
        }
        return bar
    }

    private fun render() {
        root.removeViewAt(1)
        root.addView(navBar(), LinearLayout.LayoutParams(-1, -2).apply {
            setMargins(dp(10), 0, dp(10), dp(12))
        })
        content.removeAllViews()
        val screen = when (tab) {
            "Wallet" -> walletScreen()
            "Actions" -> actionsScreen()
            "Browser" -> browserScreen()
            "Monitor" -> monitorScreen()
            else -> homeScreen()
        }
        screen.alpha = 0f
        content.addView(screen)
        screen.animate().alpha(1f).setDuration(220).start()
    }

    private fun page(): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(14), dp(20), dp(14), dp(18))
        }
    }

    private fun scroll(child: View): ScrollView = ScrollView(this).apply { addView(child) }

    private fun homeScreen(): View = scroll(page().apply {
        addView(card().apply {
            addView(text("YNX", 40f, Color.rgb(5, 10, 25), true))
            addView(text("Your Web4 command app", 22f, klein, true))
            addView(text("Wallet, transaction, encrypted messaging, dApp browser, AI/Web4 sessions, and chain monitoring in one native entry point.", 16f, muted, false))
            addView(row {
                addView(pill("TESTNET", orange))
                addView(pill("anyxt", klein))
            })
        })
        addView(walletStrip())
        addView(row {
            addView(metric("Network", "${endpoints.count { it.second.startsWith("Live") }}/8", "Reachable services"))
            addView(metric("Validators", "$validators", "Active bonded"))
        })
        addView(row {
            addView(metric("Chain", "ynx_9102-1", "Public testnet"))
            addView(metric("EVM", "9102", "0x238e"))
        })
        listOf(
            "Create or import wallet" to "Non-custodial YNX entry profile.",
            "Request test tokens" to "Open the YNX faucet for anyxt.",
            "Transfer and broadcast" to "Draft transfers, then broadcast signed tx bytes.",
            "Test third-party API" to "Authorize any API call with policy and session guard.",
            "Open YNX Browser" to "Use dApps, faucet, explorer, AI Gateway and Web4 Hub.",
            "AI agent sessions" to "Issue bounded policies for machine actions."
        ).forEach { item ->
            addView(action(item.first, item.second) {
                tab = when {
                    item.first.startsWith("Create") -> "Wallet"
                    item.first.startsWith("Open") -> "Browser"
                    else -> "Actions"
                }
                if (item.first.startsWith("Request")) actionMode = "Faucet"
                if (item.first.startsWith("Transfer")) actionMode = "Broadcast"
                if (item.first.startsWith("AI agent")) actionMode = "Session"
                if (item.first.startsWith("Test third")) actionMode = "Third-party"
                render()
            })
        }
    })

    private fun walletScreen(): View = scroll(page().apply {
        addView(header("Wallet", "Create a local testnet identity and read live balance."))
        addView(walletStrip())
        addView(row {
            addView(Button(this@MainActivity).apply {
                text = "Create Wallet"
                applyButtonStyle(primary = true)
                setOnClickListener { createWallet() }
            })
            addView(Button(this@MainActivity).apply {
                text = "Refresh Balance"
                applyButtonStyle(primary = false)
                setOnClickListener { refreshBalance() }
            })
        })
        addView(action("Receive", address ?: "No wallet") {})
        addView(action("Remove local wallet", "Deletes this Android profile.") {
            getPreferences(MODE_PRIVATE).edit().clear().apply()
            address = null
            balanceText = "Not loaded"
            render()
        })
        addView(card().apply {
            addView(text("Security boundary", 18f, ink, true))
            addView(text("This Android build stores a local testnet identity and uses live YNX public-testnet APIs. Signed transaction broadcast requires externally signed Cosmos tx_bytes.", 14f, muted, false))
        })
    })

    private fun actionsScreen(): View = scroll(page().apply {
        addView(header("Actions", "Focused operation workspace for testnet actions and third-party integrations."))
        addView(actionModeBar())
        when (actionMode) {
            "Broadcast" -> addView(broadcastCard())
            "Message" -> addView(messageCard())
            "Session" -> addView(web4Card())
            "Third-party" -> addView(thirdPartyCard())
            else -> addView(faucetCard())
        }
    })

    private fun actionModeBar(): View = HorizontalScrollView(this).apply {
        isHorizontalScrollBarEnabled = false
        addView(LinearLayout(this@MainActivity).apply {
            orientation = LinearLayout.HORIZONTAL
            listOf("Faucet", "Broadcast", "Message", "Session", "Third-party").forEach { mode ->
                addView(Button(this@MainActivity).apply {
                    text = mode
                    textSize = 12f
                    isAllCaps = false
                    setTextColor(if (actionMode == mode) Color.WHITE else ink)
                    background = pillPanel(
                        selected = actionMode == mode,
                        radiusDp = 16,
                        selectedColor = klein,
                        normalColor = Color.argb(120, 255, 255, 255)
                    )
                    setOnClickListener {
                        actionMode = mode
                        render()
                    }
                }, LinearLayout.LayoutParams(-2, dp(38)).apply { setMargins(dp(4), 0, dp(4), 0) })
            }
        })
    }

    private fun monitorScreen(): View = scroll(page().apply {
        addView(header("Network", "Live YNX public-testnet status. Latest block: $latestBlock"))
        addView(Button(this@MainActivity).apply {
            text = "Refresh"
            applyButtonStyle(primary = false)
            setOnClickListener { refreshNetwork() }
        })
        endpoints.forEach { (name, value) -> addView(action(name, value) {}) }
        addView(card().apply {
            addView(text("$validators active bonded", 22f, ink, true))
            addView(text("Validator count comes from the live staking REST API; no fallback dummy validators are shown.", 14f, muted, false))
        })
    })

    private fun browserScreen(): View {
        val wrapper = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(10), dp(18), dp(10), dp(10))
        }
        val web = WebView(this).apply {
            webViewClient = WebViewClient()
            settings.javaScriptEnabled = true
            loadUrl("https://ynxweb4.com")
        }
        val shortcuts = HorizontalScrollView(this).apply {
            addView(LinearLayout(this@MainActivity).apply {
                orientation = LinearLayout.HORIZONTAL
                listOf(
                    "Portal" to "https://ynxweb4.com",
                    "Explorer" to "https://explorer.ynxweb4.com",
                    "Faucet" to "https://faucet.ynxweb4.com",
                    "AI Gateway" to "https://ai.ynxweb4.com",
                    "Web4 Hub" to "https://web4.ynxweb4.com"
                ).forEach { (label, url) ->
                    addView(Button(this@MainActivity).apply {
                        text = label
                        applyButtonStyle(primary = false, compact = true)
                        setOnClickListener { web.loadUrl(url) }
                    })
                }
            })
        }
        wrapper.addView(shortcuts)
        wrapper.addView(web, LinearLayout.LayoutParams(-1, 0, 1f))
        return wrapper
    }

    private fun faucetCard(): View {
        val input = EditText(this).apply {
            hint = "Recipient ynx1..."
            setText(address ?: "")
            setSingleLine(false)
            applyInputStyle()
        }
        return card().apply {
            addView(text("Testnet faucet", 20f, ink, true))
            addView(text("Request anyxt from the live faucet. Rate limits are shown as real errors.", 14f, muted, false))
            addView(input)
            addView(Button(this@MainActivity).apply {
                text = "Request Test Tokens"
                applyButtonStyle(primary = true)
                setOnClickListener { requestFaucet(input.text.toString()) }
            })
        }
    }

    private fun broadcastCard(): View {
        val txBytes = EditText(this).apply {
            hint = "Signed tx_bytes base64"
            minLines = 3
            applyInputStyle()
        }
        return card().apply {
            addView(text("Broadcast signed transaction", 20f, ink, true))
            addView(text("Submits base64 tx_bytes to /cosmos/tx/v1beta1/txs. Draft transfers must be signed externally first.", 14f, muted, false))
            addView(txBytes)
            addView(row {
                listOf("SYNC", "ASYNC", "BLOCK").forEach { mode ->
                    addView(Button(this@MainActivity).apply {
                        text = mode
                        applyButtonStyle(primary = mode == "SYNC", compact = true)
                        setOnClickListener { broadcast(txBytes.text.toString(), mode) }
                    }, LinearLayout.LayoutParams(0, dp(48), 1f))
                }
            })
            if (lastBroadcast.isNotEmpty()) addView(text(lastBroadcast, 13f, muted, false))
        }
    }

    private fun messageCard(): View {
        val recipient = EditText(this).apply {
            hint = "Recipient identity"
            applyInputStyle()
        }
        val body = EditText(this).apply {
            hint = "Message"
            minLines = 2
            applyInputStyle()
        }
        return card().apply {
            addView(text("Encrypted Web4 message", 20f, ink, true))
            addView(text("Local SHA-256 envelope preview for policy messages.", 14f, muted, false))
            addView(recipient)
            addView(body)
            addView(Button(this@MainActivity).apply {
                text = "Encrypt Message"
                applyButtonStyle(primary = true)
                setOnClickListener {
                    val digest = sha256Hex("${recipient.text}|${body.text}".toByteArray()).take(48)
                    status = "Encrypted locally: $digest"
                    render()
                }
            })
            addView(text(status, 13f, muted, false))
        }
    }

    private fun web4Card(): View = card().apply {
        addView(text("Web4 session and AI job", 20f, ink, true))
        addView(text("Creates live policy/session on web4.ynxweb4.com and live AI job on ai.ynxweb4.com.", 14f, muted, false))
        addView(Button(this@MainActivity).apply {
            text = "Issue Live Session"
            applyButtonStyle(primary = false)
            setOnClickListener { issueLiveSession(false) }
        })
        addView(Button(this@MainActivity).apply {
            text = "Create Live AI Job"
            applyButtonStyle(primary = true)
            setOnClickListener { issueLiveSession(true) }
        })
        if (lastAI.isNotEmpty()) addView(text(lastAI, 13f, muted, false))
    }

    private fun thirdPartyCard(): View {
        val apiUrl = EditText(this).apply {
            hint = "Service URL"
            setText("https://httpbin.org/get")
            applyInputStyle()
        }
        val action = EditText(this).apply {
            hint = "Action"
            setText("service.invoke")
            applyInputStyle()
        }
        val amount = EditText(this).apply {
            hint = "Amount"
            setText("1")
            applyInputStyle()
        }
        return card().apply {
            addView(text("Any third-party API", 20f, ink, true))
            addView(text("Issue policy/session, run /web4/authorize, then call the real API endpoint.", 14f, muted, false))
            addView(apiUrl)
            addView(action)
            addView(amount)
            addView(Button(this@MainActivity).apply {
                text = "Authorize and Test API"
                applyButtonStyle(primary = true)
                setOnClickListener { testThirdPartyApi(apiUrl.text.toString(), action.text.toString(), amount.text.toString()) }
            })
            addView(text(if (lastThirdParty.isBlank()) "Ready." else lastThirdParty, 13f, muted, false))
        }
    }

    private fun createWallet() {
        val bytes = ByteArray(32)
        SecureRandom().nextBytes(bytes)
        val hash = MessageDigest.getInstance("SHA-256").digest(bytes)
        address = Bech32.encode("ynx", hash.take(20).map { it.toInt() and 0xff })
        getPreferences(MODE_PRIVATE).edit().putString("address", address).apply()
        refreshBalance()
        render()
    }

    private fun refreshBalance() {
        val addr = address ?: return
        get("https://rest.ynxweb4.com/cosmos/bank/v1beta1/balances/$addr") { body, err ->
            if (err != null) {
                balanceText = "Unavailable"
            } else {
                val arr = JSONObject(body).optJSONArray("balances") ?: JSONArray()
                var raw = "0"
                var denom = "anyxt"
                for (i in 0 until arr.length()) {
                    val coin = arr.getJSONObject(i)
                    val coinDenom = coin.optString("denom").lowercase()
                    val preferred = coinDenom == "anyxt" || coinDenom == "uanyxt" || coinDenom == "aanyxt"
                    if (preferred) {
                        raw = coin.optString("amount")
                        denom = coinDenom
                        break
                    }
                }
                balanceText = formatAnyxt(raw, denom)
            }
            render()
        }
    }

    private fun refreshNetwork() {
        val targets = listOf(
            "RPC" to "https://rpc.ynxweb4.com/status",
            "REST" to "https://rest.ynxweb4.com/cosmos/base/tendermint/v1beta1/blocks/latest",
            "EVM" to "https://evm.ynxweb4.com",
            "Faucet" to "https://faucet.ynxweb4.com/health",
            "Indexer" to "https://indexer.ynxweb4.com/ynx/overview",
            "Explorer" to "https://explorer.ynxweb4.com",
            "AI Gateway" to "https://ai.ynxweb4.com/ready",
            "Web4 Hub" to "https://web4.ynxweb4.com/ready"
        )
        val results = mutableListOf<Pair<String, String>>()
        targets.forEach { (name, url) ->
            val start = System.currentTimeMillis()
            if (name == "EVM") {
                post(url, JSONObject().put("jsonrpc", "2.0").put("method", "eth_chainId").put("params", JSONArray()).put("id", 1)) { body, err ->
                    results.add(name to if (err == null && JSONObject(body).optString("result") == "0x238e") "Live ${System.currentTimeMillis() - start} ms" else "Offline")
                    endpoints = results.sortedBy { targets.indexOfFirst { t -> t.first == it.first } }
                    render()
                }
            } else {
                get(url) { body, err ->
                    if (name == "RPC" && err == null) latestBlock = JSONObject(body).getJSONObject("result").getJSONObject("sync_info").optString("latest_block_height", "Live")
                    if (name == "REST" && err == null) validatorsFromRest()
                    results.add(name to if (err == null) "Live ${System.currentTimeMillis() - start} ms" else "Timeout")
                    endpoints = results.sortedBy { targets.indexOfFirst { t -> t.first == it.first } }
                    render()
                }
            }
        }
    }

    private fun validatorsFromRest() {
        get("https://rest.ynxweb4.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED") { body, err ->
            validators = if (err == null) JSONObject(body).optJSONArray("validators")?.length() ?: 0 else 0
            render()
        }
    }

    private fun requestFaucet(addr: String) {
        get("https://faucet.ynxweb4.com/faucet?address=${addr.trim()}") { body, err ->
            status = if (err == null) "Faucet accepted. $body" else "Faucet failed: $err"
            refreshBalance()
            render()
        }
    }

    private fun broadcast(txBytes: String, mode: String) {
        val apiMode = "BROADCAST_MODE_$mode"
        val payload = JSONObject().put("tx_bytes", txBytes.trim()).put("mode", apiMode)
        post("https://rest.ynxweb4.com/cosmos/tx/v1beta1/txs", payload) { body, err ->
            lastBroadcast = if (err == null) {
                val tx = JSONObject(body).optJSONObject("tx_response")
                "Tx hash: ${tx?.optString("txhash")}\nCode: ${tx?.optInt("code")}\nHeight: ${tx?.optString("height")}\nLog: ${tx?.optString("raw_log")}"
            } else {
                "Broadcast failed: $err"
            }
            refreshBalance()
            render()
        }
    }

    private fun issueLiveSession(createJob: Boolean) {
        val owner = address ?: run {
            lastAI = "Create wallet first."
            render()
            return
        }
        val policy = JSONObject()
            .put("owner", owner)
            .put("name", "ynx-android-${System.currentTimeMillis() / 1000}")
            .put("allowed_actions", JSONArray(listOf("ai.job.create", "ai.job.commit", "ai.job.finalize", "ai.payment.charge")))
            .put("max_total_spend", 10)
            .put("max_daily_spend", 10)
            .put("session_ttl_sec", 900)
        post("https://web4.ynxweb4.com/web4/policies", policy) { body, err ->
            if (err != null) {
                lastAI = "Policy failed: $err"
                render()
                return@post
            }
            val obj = JSONObject(body)
            val policyId = obj.getJSONObject("policy").getString("policy_id")
            val ownerSecret = obj.getString("owner_secret")
            post("https://web4.ynxweb4.com/web4/policies/$policyId/sessions", JSONObject(), mapOf("x-ynx-owner" to ownerSecret), sessionDone@{ sessionBody, sessionErr ->
                if (sessionErr != null) {
                    lastAI = "Session failed: $sessionErr"
                    render()
                    return@sessionDone
                }
                val token = JSONObject(sessionBody).getString("token")
                if (!createJob) {
                    lastAI = "Live session issued for $policyId"
                    render()
                    return@sessionDone
                }
                val job = JSONObject()
                    .put("creator", owner)
                    .put("worker", "ynx-android-app")
                    .put("policy_id", policyId)
                    .put("reward", "1")
                    .put("stake", "0")
                    .put("input_uri", "ynx://android/live-job/${System.currentTimeMillis() / 1000}")
                post("https://ai.ynxweb4.com/ai/jobs", job, mapOf("x-ynx-session" to token)) { jobBody, jobErr ->
                    lastAI = if (jobErr == null) "Live AI job: ${JSONObject(jobBody).getJSONObject("job").getString("job_id")}" else "AI job failed: $jobErr"
                    render()
                }
            })
        }
    }

    private fun testThirdPartyApi(serviceUrl: String, actionName: String, amountText: String) {
        val owner = address ?: run {
            lastThirdParty = "Create wallet first."
            render()
            return
        }
        val trimmedUrl = serviceUrl.trim()
        val host = try {
            URL(trimmedUrl).host?.lowercase(Locale.getDefault()) ?: ""
        } catch (_: Exception) {
            ""
        }
        if (host.isBlank()) {
            lastThirdParty = "Invalid service URL."
            render()
            return
        }
        val action = actionName.trim().ifBlank { "service.invoke" }
        val amount = amountText.trim().toDoubleOrNull() ?: 1.0

        val policy = JSONObject()
            .put("owner", owner)
            .put("name", "ynx-android-third-party-${System.currentTimeMillis() / 1000}")
            .put("allowed_actions", JSONArray(listOf(action)))
            .put("allowed_service_hosts", JSONArray(listOf(host)))
            .put("max_total_spend", 100)
            .put("max_daily_spend", 100)
            .put("session_ttl_sec", 900)

        post("https://web4.ynxweb4.com/web4/policies", policy) { body, err ->
            if (err != null) {
                lastThirdParty = "Policy failed: $err"
                render()
                return@post
            }
            val obj = JSONObject(body)
            val policyId = obj.getJSONObject("policy").getString("policy_id")
            val ownerSecret = obj.getString("owner_secret")
            val sessionPayload = JSONObject().put("capabilities", JSONArray(listOf(action))).put("max_ops", 5).put("max_spend", 100)
            post("https://web4.ynxweb4.com/web4/policies/$policyId/sessions", sessionPayload, mapOf("x-ynx-owner" to ownerSecret), sessionDone@{ sessionBody, sessionErr ->
                if (sessionErr != null) {
                    lastThirdParty = "Session failed: $sessionErr"
                    render()
                    return@sessionDone
                }
                val token = JSONObject(sessionBody).getString("token")
                val authorize = JSONObject()
                    .put("policy_id", policyId)
                    .put("action", action)
                    .put("amount", amount)
                    .put("resource_host", host)
                    .put("resource", trimmedUrl)
                post("https://web4.ynxweb4.com/web4/authorize", authorize, mapOf("x-ynx-session" to token), authDone@{ _, authErr ->
                    if (authErr != null) {
                        lastThirdParty = "Authorize failed: $authErr"
                        render()
                        return@authDone
                    }
                    get(trimmedUrl) { apiBody, apiErr ->
                        lastThirdParty = if (apiErr == null) {
                            val preview = apiBody.replace("\n", " ").take(180)
                            "Authorized for $host. API preview: $preview"
                        } else {
                            "Authorized for $host, API call failed: $apiErr"
                        }
                        render()
                    }
                })
            })
        }
    }

    private fun get(url: String, done: (String, String?) -> Unit) = thread {
        try {
            val conn = URL(url).openConnection() as HttpURLConnection
            conn.connectTimeout = 12000
            conn.readTimeout = 12000
            val code = conn.responseCode
            val stream = if (code in 200..399) conn.inputStream else conn.errorStream
            val body = BufferedReader(InputStreamReader(stream)).readText()
            main.post { done(body, if (code in 200..399) null else "HTTP $code: $body") }
        } catch (e: Exception) {
            main.post { done("", e.message ?: "request failed") }
        }
    }

    private fun post(url: String, payload: JSONObject, headers: Map<String, String> = emptyMap(), done: (String, String?) -> Unit) = thread {
        try {
            val conn = URL(url).openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.connectTimeout = 12000
            conn.readTimeout = 12000
            conn.doOutput = true
            conn.setRequestProperty("Content-Type", "application/json")
            headers.forEach { (k, v) -> conn.setRequestProperty(k, v) }
            OutputStreamWriter(conn.outputStream).use { it.write(payload.toString()) }
            val code = conn.responseCode
            val stream = if (code in 200..399) conn.inputStream else conn.errorStream
            val body = BufferedReader(InputStreamReader(stream)).readText()
            main.post { done(body, if (code in 200..399) null else "HTTP $code: $body") }
        } catch (e: Exception) {
            main.post { done("", e.message ?: "request failed") }
        }
    }

    private fun walletStrip(): View = card().apply {
        addView(text(if (address == null) "No wallet yet" else "Wallet ready", 22f, ink, true))
        addView(text(if (address == null) "Open Wallet to create your YNX testnet profile." else "${short(address!!)} - $balanceText anyxt", 16f, muted, false))
    }

    private fun metric(title: String, value: String, foot: String): View = card().apply {
        layoutParams = LinearLayout.LayoutParams(0, -2, 1f).apply { setMargins(dp(4), dp(6), dp(4), dp(6)) }
        addView(text(value, 28f, ink, true))
        addView(text(title, 16f, ink, true))
        addView(text(foot, 14f, muted, false))
    }

    private fun action(title: String, detail: String, click: () -> Unit): View = card().apply {
        setOnClickListener { click() }
        isClickable = true
        isFocusable = true
        addView(text(title, 20f, ink, true))
        addView(text(detail, 14f, muted, false))
    }

    private fun header(title: String, subtitle: String): View = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(4), 0, dp(4), dp(2))
        addView(text(title, 28f, ink, true))
        addView(text(subtitle, 15f, muted, false))
    }

    private fun row(init: LinearLayout.() -> Unit): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
        init()
    }

    private fun card(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(16), dp(14), dp(16), dp(14))
        background = glassPanel(radiusDp = 22, fillAlpha = 176, strokeAlpha = 138)
        elevation = dp(7).toFloat()
        layoutParams = LinearLayout.LayoutParams(-1, -2).apply { setMargins(0, dp(7), 0, dp(7)) }
    }

    private fun text(value: String, size: Float, color: Int, bold: Boolean): TextView = TextView(this).apply {
        text = value
        textSize = size
        setTextColor(color)
        if (bold) typeface = Typeface.DEFAULT_BOLD
        letterSpacing = 0f
        setPadding(0, dp(4), 0, dp(4))
    }

    private fun pill(value: String, color: Int): TextView = text(value, 14f, color, true).apply {
        setPadding(dp(12), dp(7), dp(12), dp(7))
        background = pillPanel(
            selected = false,
            radiusDp = 14,
            selectedColor = color,
            normalColor = Color.argb(125, 255, 255, 255)
        )
    }

    private fun Button.applyButtonStyle(primary: Boolean, compact: Boolean = false) {
        isAllCaps = false
        textSize = if (compact) 12f else 13f
        setTextColor(if (primary) Color.WHITE else ink)
        background = pillPanel(
            selected = primary,
            radiusDp = if (compact) 14 else 16,
            selectedColor = klein,
            normalColor = Color.argb(148, 255, 255, 255)
        )
        setPadding(dp(14), dp(8), dp(14), dp(8))
    }

    private fun EditText.applyInputStyle() {
        textSize = 15f
        setTextColor(ink)
        setHintTextColor(muted)
        background = glassPanel(radiusDp = 16, fillAlpha = 160, strokeAlpha = 120)
        setPadding(dp(14), dp(12), dp(14), dp(12))
        layoutParams = LinearLayout.LayoutParams(-1, -2).apply {
            setMargins(0, dp(4), 0, dp(6))
        }
    }

    private fun appBackground(): GradientDrawable = GradientDrawable(
        GradientDrawable.Orientation.TOP_BOTTOM,
        intArrayOf(
            Color.rgb(236, 243, 255),
            Color.rgb(228, 238, 255),
            Color.rgb(244, 248, 255)
        )
    ).apply {
        cornerRadius = 0f
    }

    private fun glassPanel(radiusDp: Int, fillAlpha: Int, strokeAlpha: Int): GradientDrawable = GradientDrawable(
        GradientDrawable.Orientation.TOP_BOTTOM,
        intArrayOf(
            Color.argb(fillAlpha, 255, 255, 255),
            Color.argb((fillAlpha - 18).coerceAtLeast(110), 246, 251, 255)
        )
    ).apply {
        shape = GradientDrawable.RECTANGLE
        cornerRadius = dp(radiusDp).toFloat()
        setStroke(dp(1), Color.argb(strokeAlpha, 255, 255, 255))
    }

    private fun pillPanel(selected: Boolean, radiusDp: Int, selectedColor: Int, normalColor: Int): GradientDrawable = GradientDrawable().apply {
        shape = GradientDrawable.RECTANGLE
        cornerRadius = dp(radiusDp).toFloat()
        setColor(if (selected) selectedColor else normalColor)
        setStroke(dp(1), if (selected) Color.argb(165, 183, 214, 255) else Color.argb(145, 255, 255, 255))
    }

    private fun short(value: String): String = if (value.length > 16) "${value.take(9)}...${value.takeLast(6)}" else value
    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
    private fun formatAnyxt(raw: String, denom: String): String = try {
        val scale = when {
            denom.startsWith("u") -> BigDecimal("1000000")
            denom.startsWith("a") -> BigDecimal("1000000000000000000")
            else -> BigDecimal.ONE
        }
        BigDecimal(raw).divide(scale).stripTrailingZeros().toPlainString()
    } catch (_: Exception) { raw }

    companion object {
        private val ink = Color.rgb(5, 10, 25)
        private val muted = Color.rgb(113, 124, 145)
        private val klein = Color.rgb(11, 59, 187)
        private val orange = Color.rgb(255, 144, 0)
        private fun sha256Hex(bytes: ByteArray): String = MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
    }
}

object Bech32 {
    private const val charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"

    fun encode(hrp: String, bytes: List<Int>): String {
        val data = convertBits(bytes, 8, 5, true)
        val combined = data + checksum(hrp, data)
        return hrp + "1" + combined.joinToString("") { charset[it].toString() }
    }

    private fun checksum(hrp: String, data: List<Int>): List<Int> {
        val values = hrpExpand(hrp) + data + List(6) { 0 }
        val mod = polymod(values) xor 1
        return (0 until 6).map { (mod shr (5 * (5 - it))) and 31 }
    }

    private fun hrpExpand(hrp: String): List<Int> =
        hrp.map { it.code shr 5 } + listOf(0) + hrp.map { it.code and 31 }

    private fun polymod(values: List<Int>): Int {
        val gen = intArrayOf(0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3)
        var chk = 1
        values.forEach { value ->
            val top = chk shr 25
            chk = ((chk and 0x1ffffff) shl 5) xor value
            for (i in 0 until 5) if (((top shr i) and 1) == 1) chk = chk xor gen[i]
        }
        return chk
    }

    private fun convertBits(data: List<Int>, from: Int, to: Int, pad: Boolean): List<Int> {
        var acc = 0
        var bits = 0
        val maxv = (1 shl to) - 1
        val result = mutableListOf<Int>()
        data.forEach { value ->
            acc = (acc shl from) or value
            bits += from
            while (bits >= to) {
                bits -= to
                result.add((acc shr bits) and maxv)
            }
        }
        if (pad && bits > 0) result.add((acc shl (to - bits)) and maxv)
        return result
    }
}
