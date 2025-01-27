<script lang="ts">
    import type {Module} from "$lib/models/grades.model";
    import {faCrown} from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import {getGradeColor} from "$lib/utils";

    export let module: Module;
</script>

<div class="module-box" role="button" tabindex="0">
    <div class="module-name-box">
        <p class="module-name">{module.name}</p>
        {#if module.ects }
            <p class="ects">{module.ects}</p>
        {:else}
            <p class="ects">Estimation</p>
        {/if}
    </div>
    <div class="mark">
        <div class="mark-box {module.calculatedGrade ? 'generated-mark' : getGradeColor(module.letterGrade, module.mark)}">
            {#if module.mark}
                <p>{(module.mark).toFixed(2)}</p>
                <div class="vertical-separator"></div>
            {:else if module.calculatedGrade}
                <p>{(module.calculatedGrade).toFixed(2)}</p>
                <div class="vertical-separator"></div>
            {/if}
            {#if module.letterGrade}
                <p>{module.letterGrade}</p>
            {/if}
        </div>
        {#if module.details && module.details.details && module.details.details.ranking === 1}
            <div class="crown">
                <Fa icon="{faCrown}" color="#ffe03c" rotate="45"/>
            </div>
        {/if}
    </div>
</div>

<style>
    .module-box {
        border-top: 1px solid rgba(163, 163, 163, 0.35);
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        transition: 0.2s;
        cursor: pointer;
    }

    .module-box:hover {
        background-color: rgba(145, 145, 145, 0.07);
        transition: 0.3s;
    }

    .mark-box {
        text-align: center;
        padding: 7px;
        border-radius: 10px;
        width: 50px;
        font-size: 13px;
        color: white;
        font-weight: 700;
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .mark.crown {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
    }
    .generated-mark {
        background: var(--primary-color);
    }

    .module-name-box {
        display: flex;
        flex-direction: column;
        padding: 10px;
    }

    .ects {
        font-size: 12px;
        font-weight: normal;
        margin: 0;
    }

    .module-name {
        font-size: 13px;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: 700;
        margin: 0;
        white-space: nowrap;
    }

    @media (max-width: 500px) {
        .module-name {
            width: 100px;
        }
    }

    .vertical-separator {
        width: 2px;
        border-radius: 4px;
        background: rgb(255, 255, 255);
    }
</style>