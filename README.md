# Credit Society Bot

Credit Society Bot is a community credit tracking assistant built with [`discord.py`](https://discordpy.readthedocs.io/).

## Features
- Track per-member credit balances entirely in memory
- Grant or deduct credits with permission-gated commands
- Attach notes to member credit records
- Rich embed responses for balance and help commands

## Getting Started
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Create a Discord bot application and copy its token.
3. Set the token in the environment and run the bot:
   ```bash
   export DISCORD_TOKEN=your_token_here
   python -m credit_society_bot
   ```

The bot listens for commands prefixed with `!` by default. Use `!helpcredits` for an overview of available commands.

> **Note**: The ledger is stored in-memory. Restarting the bot resets balances and notes.
