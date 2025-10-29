"""Credit Society Bot implementation using discord.py.

This module exposes a ``create_bot`` helper that builds the bot with a
collection of commands tailored for a community-based credit tracking
system.  The bot can be run directly by executing the module and setting
``DISCORD_TOKEN`` in the environment, or imported elsewhere for testing
purposes.
"""
from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Dict, Optional

import discord
from discord.ext import commands


LOGGER = logging.getLogger(__name__)


@dataclass
class MemberCredit:
    """Represents a community member's credit balance."""

    balance: int = 0
    notes: Optional[str] = None

    def deposit(self, amount: int) -> None:
        """Increase the balance by ``amount``.

        Parameters
        ----------
        amount:
            The number of credits to add.  Must be positive.
        """
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount

    def withdraw(self, amount: int) -> None:
        """Decrease the balance by ``amount``.

        Parameters
        ----------
        amount:
            The number of credits to remove.  Must be positive and not
            exceed the current balance.
        """
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient credit balance")
        self.balance -= amount


class CreditLedger:
    """Tracks the credit balances for guild members."""

    def __init__(self) -> None:
        self._credits: Dict[int, MemberCredit] = {}

    def get_credit(self, member: discord.abc.User) -> MemberCredit:
        return self._credits.setdefault(member.id, MemberCredit())

    def deposit(self, member: discord.abc.User, amount: int) -> MemberCredit:
        credit = self.get_credit(member)
        credit.deposit(amount)
        return credit

    def withdraw(self, member: discord.abc.User, amount: int) -> MemberCredit:
        credit = self.get_credit(member)
        credit.withdraw(amount)
        return credit

    def set_notes(self, member: discord.abc.User, notes: Optional[str]) -> MemberCredit:
        credit = self.get_credit(member)
        credit.notes = notes
        return credit


def create_bot(command_prefix: str = "!") -> commands.Bot:
    """Create an instance of Credit Society Bot.

    Parameters
    ----------
    command_prefix:
        The prefix that triggers commands.  Defaults to ``!``.
    """

    intents = discord.Intents.default()
    intents.message_content = True

    bot = commands.Bot(command_prefix=command_prefix, intents=intents)
    ledger = CreditLedger()

    @bot.event
    async def on_ready() -> None:
        LOGGER.info("Credit Society Bot connected as %s", bot.user)

    @bot.command(name="balance")
    async def balance(ctx: commands.Context, member: Optional[discord.Member] = None) -> None:
        """Show the credit balance for the invoking or specified member."""

        target = member or ctx.author
        credit = ledger.get_credit(target)
        embed = discord.Embed(
            title="Credit Balance",
            description=f"{target.mention} has **{credit.balance}** credits.",
            color=discord.Color.blue(),
        )
        if credit.notes:
            embed.add_field(name="Notes", value=credit.notes, inline=False)
        await ctx.send(embed=embed)

    @bot.command(name="deposit")
    @commands.has_permissions(manage_guild=True)
    async def deposit(ctx: commands.Context, member: discord.Member, amount: int) -> None:
        """Add credits to a member."""

        try:
            credit = ledger.deposit(member, amount)
        except ValueError as err:
            await ctx.send(f"❌ {err}")
            return
        await ctx.send(f"✅ Added {amount} credits to {member.mention}. New balance: {credit.balance}.")

    @bot.command(name="withdraw")
    @commands.has_permissions(manage_guild=True)
    async def withdraw(ctx: commands.Context, member: discord.Member, amount: int) -> None:
        """Remove credits from a member."""

        try:
            credit = ledger.withdraw(member, amount)
        except ValueError as err:
            await ctx.send(f"❌ {err}")
            return
        await ctx.send(f"✅ Deducted {amount} credits from {member.mention}. New balance: {credit.balance}.")

    @bot.command(name="setnote")
    @commands.has_permissions(manage_guild=True)
    async def setnote(ctx: commands.Context, member: discord.Member, *, note: Optional[str] = None) -> None:
        """Attach a note to a member's credit record."""

        credit = ledger.set_notes(member, note)
        note_display = note or "No notes"
        await ctx.send(f"📝 Note for {member.mention}: {note_display}\nCurrent balance: {credit.balance}")

    @bot.command(name="helpcredits")
    async def helpcredits(ctx: commands.Context) -> None:
        """Display help information for Credit Society Bot commands."""

        description = (
            "Welcome to Credit Society Bot!\n\n"
            "Commands:\n"
            "• `!balance [member]` — show credit balance.\n"
            "• `!deposit <member> <amount>` — add credits (manage_guild only).\n"
            "• `!withdraw <member> <amount>` — remove credits (manage_guild only).\n"
            "• `!setnote <member> [note]` — set or clear a note (manage_guild only)."
        )
        embed = discord.Embed(title="Credit Society Bot", description=description, color=discord.Color.green())
        await ctx.send(embed=embed)

    return bot


def main() -> None:
    """Entrypoint used when running the module directly."""

    token = os.getenv("DISCORD_TOKEN")
    if not token:
        raise RuntimeError("DISCORD_TOKEN environment variable is required to run the bot.")

    logging.basicConfig(level=logging.INFO)
    bot = create_bot()
    bot.run(token)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        LOGGER.info("Credit Society Bot interrupted by user; shutting down.")
    except Exception:  # pragma: no cover - log unexpected errors before re-raising.
        LOGGER.exception("Credit Society Bot encountered an unexpected error")
        raise
