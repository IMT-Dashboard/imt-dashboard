<script lang="ts">
    import type {Grade} from "$lib/models/grades.model";
    import Fa from "svelte-fa";
    import {faCrown, faPoo} from "@fortawesome/free-solid-svg-icons";

    export let grade: Grade;
</script>


<div class="grade-box" role="button" tabindex="0">
    <div class="note-name-box">
        <p class="note-name">{grade.name}</p>
        {#if grade.coeff !== 0}
            <p class="coef">Coef. {grade.coeff}</p>
        {/if}
    </div>
    <div class="mark">
        {grade.mark}
        {#if grade.details && !grade.details.hasBeenSeen}
            <div class="notification">NEW</div>
        {:else if grade.details && grade.details.ranking === 1 && grade.details.total > 1}
            <div class="indicator">
                <Fa icon="{faCrown}" color="#ffe03c" rotate="45"></Fa>
            </div>
        {:else if grade.details && grade.details.ranking === grade.details.total && grade.details.total > 1}
            <div class="indicator">
                <Fa icon="{faPoo}" color="#925b38" rotate="45"></Fa>
            </div>
        {/if}
    </div>
</div>

<style>
    .grade-box {
        border-top: 1px solid rgba(163, 163, 163, 0.35);
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        transition: 0.2s;
        cursor: pointer;

    }

    .grade-box:hover {
        background-color: rgba(145, 145, 145, 0.07);
        transition: 0.3s;
    }

    .note-name-box {
        display: flex;
        flex-direction: column;
        padding: 10px;
    }

    .note-name {
        font-size: 13px;
        font-weight: 700;
        margin: 0;
    }

    .coef {
        font-size: 12px;
        margin: 0;
        font-weight: normal;
    }

    .mark {
        text-align: center;
        padding: 7px;
        border-radius: 10px;
        width: 50px;
        font-size: 13px;
        background-color: var(--accent);
        color: white;
        font-weight: 700;
        position: relative;
    }

    .indicator {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
    }

    .notification {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(25%, -25%);
        width: 23px;
        height: 10px;
        border-radius: 10px;
        background-color: #ff3c3c;
        font-size: 7px;
        padding: 1px;
        color: white;
    }

</style>